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
arb_tailwind = re.compile(r'(rounded-\[\d+px\]|text-\[\d+px\]|bg-\[#[0-9a-fA-F]{3,8}\]|text-\[#[0-9a-fA-F]{3,8}\]|border-\[#[0-9a-fA-F]{3,8}\]|stroke-\[#[0-9a-fA-F]{3,8}\]|fill-\[#[0-9a-fA-F]{3,8}\]|ring-\[#[0-9a-fA-F]{3,8}\])')

all_caps_list = ["HEALTHY", "CRITICAL", "ON TRIP", "PENDING", "COMPLETED", "DISPATCHED", "IN PROGRESS", "ACTIVE", "INACTIVE", "LOW LEVEL", "NORMAL", "HIGH", "MEDIUM", "LOW", "URGENT", "ONLINE", "OFFLINE", "RESOLVED", "OPEN", "IN MAINTENANCE", "ONTRIP"]

placeholder_names = ["Residence", "Resident", "Sipho Ndlovu", "TRK-001", "DRV-101", "John Doe", "Driver #1", "Driver #2", "Sipho Dlamini", "Lerato Motsepe", "Tshepo Khumalo"]

report = {}

for filepath in sorted(jsx_files):
    rel_path = os.path.relpath(filepath, 'frontend/src').replace('\\', '/')
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        lines = f.readlines()
        
    findings = []
    
    for idx, line in enumerate(lines, 1):
        clean = line.strip()
        if not clean or clean.startswith('//') or clean.startswith('/*') or clean.startswith('*'):
            continue
            
        # Cat 1: Raw code or enum values shown to users
        for enum_val in ["ONTRIP", "ON_TRIP", "OnTrip", "IN_PROGRESS", "LOW_LEVEL", "DAM_CAPACITY_LOW", "WATER_LEVEL_CRITICAL", "ACTIVE", "INACTIVE"]:
            # Check if rendered in UI text or badge
            if (f"'{enum_val}'" in line or f'"{enum_val}"' in line or f">{enum_val}<" in line) and not line.strip().startswith('import') and not 'case' in line and not 'status ===' in line and not 'status:' in line and not 'const' in line:
                findings.append({
                    "line": idx,
                    "cat": 1,
                    "cat_name": "Category 1: Raw code or enum values shown to users",
                    "code": clean,
                    "desc": f"Raw enum constant '{enum_val}' rendered directly in UI"
                })
            elif enum_val in ["ACTIVE", "INACTIVE"] and f">{enum_val}<" in line:
                findings.append({
                    "line": idx,
                    "cat": 1,
                    "cat_name": "Category 1: Raw code or enum values shown to users",
                    "code": clean,
                    "desc": f"Raw enum value '{enum_val}' shown directly to users"
                })

        # Cat 2: Internal notes or spec references in the UI
        spec_m = spec_pattern.search(line)
        if spec_m:
            findings.append({
                "line": idx,
                "cat": 2,
                "cat_name": "Category 2: Internal notes or spec references in the UI",
                "code": clean,
                "desc": f"Internal specification reference '{spec_m.group(0)}' present in UI heading/label"
            })
            
        # Cat 3: Marketing filler text
        if any(phrase in clean.lower() for phrase in [
            "empowering communities through smart water management",
            "telemetry excellence",
            "smart water management and real-time telemetry",
            "cutting-edge telemetry",
            "smart water telemetry excellence"
        ]):
            findings.append({
                "line": idx,
                "cat": 3,
                "cat_name": "Category 3: Marketing filler text that doesn't say anything concrete",
                "code": clean,
                "desc": "Marketing filler text displayed in UI"
            })
            
        # Cat 4: Text bugs
        for p_name in placeholder_names:
            if (f"'{p_name}'" in line or f'"{p_name}"' in line or f">{p_name}<" in line) and not 'const' in line and not 'let' in line and not 'type' in line and not 'function' in line and not 'id:' in line:
                findings.append({
                    "line": idx,
                    "cat": 4,
                    "cat_name": "Category 4: Text bugs: missing spaces, truncated text, placeholder names or hardcoded driver names/IDs",
                    "code": clean,
                    "desc": f"Hardcoded placeholder or driver name '{p_name}' used in UI instead of dynamic state"
                })
        if re.search(r'>\w+:\$\{|\}\w+<|"[A-Za-z]+:"\s*\+', line):
            findings.append({
                "line": idx,
                "cat": 4,
                "cat_name": "Category 4: Text bugs: missing spaces, truncated text, placeholder names or hardcoded driver names/IDs",
                "code": clean,
                "desc": "Missing space before or after string concatenation or JSX variable interpolation"
            })
            
        # Cat 5: Emoji used as icons
        emojis = [ch for ch in clean if ord(ch) in [0x1F4A0, 0x1F4A7, 0x1F69B, 0x1F6A8, 0x1F4CA, 0x26A0, 0x26FD, 0x2705, 0x274C, 0x2753, 0x2757, 0x1F6A6, 0x1F6A2, 0x1F69A, 0x1F697, 0x1F6E0, 0x1F4CB, 0x1F512, 0x1F511, 0x1F464, 0x1F4AC, 0x1F514, 0x2699, 0x1F300, 0x1F30A, 0x1F4C8, 0x1F6E1]]
        if emojis:
            findings.append({
                "line": idx,
                "cat": 5,
                "cat_name": "Category 5: Emoji used as icons, or icons from mixed sets / inconsistent sizes",
                "code": clean,
                "desc": f"Emoji character(s) '{''.join(emojis)}' used as UI icon"
            })
            
        # Cat 7: All-caps badges and labels
        for ac in all_caps_list:
            if (f">{ac}<" in line or f"> {ac} <" in line or f"'{ac}'" in line or f'"{ac}"' in line) and ('Badge' in line or 'badge' in line or 'span' in line or 'td' in line or 'h2' in line or 'h3' in line or 'p' in line or 'div' in line):
                if not f"{ac}:" in line and not "const" in line and not "let" in line:
                    findings.append({
                        "line": idx,
                        "cat": 7,
                        "cat_name": "Category 7: All-caps badges and labels that could be sentence case",
                        "code": clean,
                        "desc": f"ALL-CAPS label or badge text '{ac}' used"
                    })

        # Cat 9: Hardcoded hex colours, radii and font sizes
        tw_matches = arb_tailwind.findall(line)
        if tw_matches:
            findings.append({
                "line": idx,
                "cat": 9,
                "cat_name": "Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place",
                "code": clean,
                "desc": f"Hardcoded Tailwind arbitrary value(s): {', '.join(tw_matches)}"
            })
        elif hex_pattern.search(line) and not line.strip().startswith('import') and not line.strip().startswith('//'):
            if 'style=' in line or 'color' in line.lower() or 'bg-' in line or 'text-' in line or 'border-' in line or '#' in line:
                hexes = hex_pattern.findall(line)
                findings.append({
                    "line": idx,
                    "cat": 9,
                    "cat_name": "Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place",
                    "code": clean,
                    "desc": f"Hardcoded hex colour(s): {', '.join(hexes)}"
                })

    # Cat 8: Duplicated UI within file
    full_text = "".join(lines)
    if 'BrandLogo' in full_text and full_text.count('<BrandLogo') > 1:
        for lno, l in enumerate(lines, 1):
            if '<BrandLogo' in l:
                findings.append({
                    "line": lno,
                    "cat": 8,
                    "cat_name": "Category 8: Duplicated UI",
                    "code": l.strip(),
                    "desc": "Multiple <BrandLogo> components rendered in the same component layout"
                })
    if 'LanguageSwitcher' in full_text and full_text.count('<LanguageSwitcher') > 1:
        for lno, l in enumerate(lines, 1):
            if '<LanguageSwitcher' in l:
                findings.append({
                    "line": lno,
                    "cat": 8,
                    "cat_name": "Category 8: Duplicated UI",
                    "code": l.strip(),
                    "desc": "Multiple <LanguageSwitcher> components rendered in the same component layout"
                })

    if findings:
        report[rel_path] = findings

with open('scratch/report_v2.json', 'w', encoding='utf-8') as out:
    json.dump(report, out, indent=2)

print(f"Report v2 completed for {len(jsx_files)} files. Issues found in {len(report)} files.")
