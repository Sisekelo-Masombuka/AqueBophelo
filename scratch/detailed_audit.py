import os, sys, re, json

sys.stdout.reconfigure(encoding='utf-8')

src_dir = r'frontend/src'
exclude_file = 'LiveMap.jsx'

jsx_files = []
for root, dirs, files in os.walk(src_dir):
    for file in files:
        if file == exclude_file:
            continue
        filepath = os.path.join(root, file)
        if file.endswith('.jsx'):
            jsx_files.append(filepath)
        elif file.endswith('.js'):
            with open(filepath, 'r', encoding='utf-8', errors='ignore') as file_obj:
                content = file_obj.read()
                if '<' in content and '</' in content:
                    jsx_files.append(filepath)

# Patterns
spec_pattern = re.compile(r'\(Section\s*[\d\.]+\)|\(Item\s*[\d\.]+\)|\(Req\s*[\d\.]+\)', re.IGNORECASE)
hex_pattern = re.compile(r'#[0-9a-fA-F]{3,8}')
arbitrary_hex_pattern = re.compile(r'(?:bg|text|border|ring|stroke|fill)-\[#[0-9a-fA-F]{3,8}\]')
arbitrary_radius_pattern = re.compile(r'rounded-\[\d+px\]')
arbitrary_size_pattern = re.compile(r'text-\[\d+px\]')

raw_enum_values = [
    "ONTRIP", "ON_TRIP", "OnTrip", "IN_PROGRESS", "INPROGRESS",
    "HEALTHY", "CRITICAL", "LOW_LEVEL", "DISPATCHED", "PENDING",
    "COMPLETED", "IN_MAINTENANCE", "ACTIVE", "INACTIVE", "OUT_OF_SERVICE",
    "SCHEDULED_MAINTENANCE", "WATER_LEVEL_CRITICAL", "DAM_CAPACITY_LOW"
]

all_caps_words = [
    "HEALTHY", "CRITICAL", "ON TRIP", "PENDING", "COMPLETED",
    "DISPATCHED", "IN PROGRESS", "ACTIVE", "INACTIVE", "LOW LEVEL",
    "NORMAL", "HIGH", "MEDIUM", "LOW", "URGENT", "ONLINE", "OFFLINE",
    "RESOLVED", "OPEN", "IN MAINTENANCE", "ONTRIP"
]

report_by_file = {}

for filepath in sorted(jsx_files):
    rel_path = os.path.relpath(filepath, 'frontend/src').replace('\\', '/')
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        lines = f.readlines()
        
    findings = []
    
    for idx, line in enumerate(lines, 1):
        clean = line.strip()
        if not clean or clean.startswith('//') or clean.startswith('/*') or clean.startswith('*'):
            continue

        # 1. Raw code or enum values shown to users
        # Look for enum string literals in JSX text or props passed to badges/labels
        for enum_val in ["ONTRIP", "ON_TRIP", "OnTrip", "IN_PROGRESS", "LOW_LEVEL", "DAM_CAPACITY_LOW", "WATER_LEVEL_CRITICAL", "IN_MAINTENANCE", "OUT_OF_SERVICE"]:
            if enum_val in line and not line.strip().startswith('import') and not 'case' in line:
                findings.append({
                    "line": idx,
                    "cat": 1,
                    "cat_name": "Category 1: Raw code or enum values shown to users",
                    "detail": f"Raw enum constant '{enum_val}' rendered/used in UI component",
                    "code": clean
                })
                
        # 2. Internal notes or spec references in the UI
        spec_m = spec_pattern.search(line)
        if spec_m:
            findings.append({
                "line": idx,
                "cat": 2,
                "cat_name": "Category 2: Internal notes or spec references in the UI",
                "detail": f"Internal specification reference '{spec_m.group(0)}' present in UI",
                "code": clean
            })
            
        # 3. Marketing filler text
        if any(m_phrase in clean.lower() for m_phrase in [
            "empowering communities through smart water management",
            "telemetry excellence",
            "smart water management and real-time telemetry",
            "cutting-edge telemetry",
            "seamless water management solution"
        ]):
            findings.append({
                "line": idx,
                "cat": 3,
                "cat_name": "Category 3: Marketing filler text that doesn't say anything concrete",
                "detail": "Generic marketing filler text displayed in UI",
                "code": clean
            })
            
        # 4. Text bugs (missing spaces, placeholders, hardcoded names/driver IDs)
        if re.search(r'"Residence"|"Resident"|Sipho Ndlovu|TRK-001|DRV-101|John Doe|Driver #\d', line):
            if not 'const ' in line and not 'let ' in line and not 'type' in line:
                findings.append({
                    "line": idx,
                    "cat": 4,
                    "cat_name": "Category 4: Text bugs: missing spaces, truncated text, placeholder names or hardcoded driver names/IDs",
                    "detail": "Hardcoded driver/vehicle ID or placeholder name used instead of dynamic data",
                    "code": clean
                })
        # Missing space check in concatenation or text template
        if re.search(r'>\w+:\$\{|\}\w+<|"[A-Za-z]+:"\s*\+', line):
            findings.append({
                "line": idx,
                "cat": 4,
                "cat_name": "Category 4: Text bugs: missing spaces, truncated text, placeholder names or hardcoded driver names/IDs",
                "detail": "Missing space before or after string concatenation/variable interpolation",
                "code": clean
            })
            
        # 5. Emoji used as icons
        emojis_found = []
        for ch in clean:
            pt = ord(ch)
            if pt in [0x1F4A0, 0x1F4A7, 0x1F69B, 0x1F6A8, 0x1F4CA, 0x26A0, 0x26FD, 0x2705, 0x274C, 0x2753, 0x2757, 0x1F6A6, 0x1F6A2, 0x1F69A, 0x1F697, 0x1F6E0, 0x1F4CB, 0x1F512, 0x1F511, 0x1F464, 0x1F4AC, 0x1F514, 0x2699, 0x1F300, 0x1F30A, 0x1F4C8, 0x1F6E1]:
                emojis_found.append(ch)
        if emojis_found:
            findings.append({
                "line": idx,
                "cat": 5,
                "cat_name": "Category 5: Emoji used as icons, or icons from mixed sets / inconsistent sizes",
                "detail": f"Emoji character(s) '{''.join(emojis_found)}' used as UI icon(s)",
                "code": clean
            })
            
        # 7. All-caps badges and labels
        for ac_word in all_caps_words:
            # check if inside JSX element text or Badge string prop
            if (f">{ac_word}<" in line or f"> {ac_word} <" in line or f"'{ac_word}'" in line or f'"{ac_word}"' in line) and ('Badge' in line or 'badge' in line or 'span' in line or 'td' in line or 'h' in line):
                # avoid matching JS object keys
                if not f"{ac_word}:" in line:
                    findings.append({
                        "line": idx,
                        "cat": 7,
                        "cat_name": "Category 7: All-caps badges and labels that could be sentence case",
                        "detail": f"ALL-CAPS label/badge text '{ac_word}' used",
                        "code": clean
                    })
                    
        # 9. Hardcoded hex colours, radii and font sizes
        hex_matches = hex_pattern.findall(line)
        arb_hex = arbitrary_hex_pattern.findall(line)
        arb_rad = arbitrary_radius_pattern.findall(line)
        arb_sz = arbitrary_size_pattern.findall(line)
        
        if arb_hex or arb_rad or arb_sz:
            items = arb_hex + arb_rad + arb_sz
            findings.append({
                "line": idx,
                "cat": 9,
                "cat_name": "Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place",
                "detail": f"Hardcoded Tailwind arbitrary value(s): {', '.join(items)}",
                "code": clean
            })
        elif hex_matches and not line.strip().startswith('import') and not line.strip().startswith('//'):
            # check if hex is inline style or property
            if 'style=' in line or 'color' in line.lower() or 'bg-' in line or 'text-' in line or 'border-' in line or '#' in line:
                findings.append({
                    "line": idx,
                    "cat": 9,
                    "cat_name": "Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place",
                    "detail": f"Hardcoded hex colour(s): {', '.join(hex_matches)}",
                    "code": clean
                })

    if findings:
        report_by_file[rel_path] = findings

with open('scratch/full_audit_results.json', 'w', encoding='utf-8') as f_out:
    json.dump(report_by_file, f_out, indent=2)

print(f"Audit completed for {len(jsx_files)} files. Found issues in {len(report_by_file)} files.")
