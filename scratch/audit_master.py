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

# Regexes
spec_pattern = re.compile(r'\(Section\s*[\d\.]+\)|\(Item\s*[\d\.]+\)|\(Req\s*[\d\.]+\)', re.IGNORECASE)
hex_pattern = re.compile(r'#[0-9a-fA-F]{3,8}')
arb_tailwind = re.compile(r'(rounded-\[\d+px\]|text-\[\d+px\]|bg-\[#[0-9a-fA-F]{3,8}\]|text-\[#[0-9a-fA-F]{3,8}\]|border-\[#[0-9a-fA-F]{3,8}\]|stroke-\[#[0-9a-fA-F]{3,8}\]|fill-\[#[0-9a-fA-F]{3,8}\]|ring-\[#[0-9a-fA-F]{3,8}\])')

raw_enums = ["ONTRIP", "ON_TRIP", "OnTrip", "IN_PROGRESS", "INPROGRESS", "HEALTHY", "CRITICAL", "LOW_LEVEL", "DISPATCHED", "PENDING", "COMPLETED", "IN_MAINTENANCE", "ACTIVE", "INACTIVE", "OUT_OF_SERVICE", "SCHEDULED_MAINTENANCE", "WATER_LEVEL_CRITICAL", "DAM_CAPACITY_LOW"]

all_caps = ["HEALTHY", "CRITICAL", "ON TRIP", "PENDING", "COMPLETED", "DISPATCHED", "IN PROGRESS", "ACTIVE", "INACTIVE", "LOW LEVEL", "NORMAL", "HIGH", "MEDIUM", "LOW", "URGENT", "ONLINE", "OFFLINE", "RESOLVED", "OPEN", "IN MAINTENANCE", "ONTRIP"]

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
            
        # 1. Raw code or enum values shown to users
        for enum_val in ["ONTRIP", "ON_TRIP", "OnTrip", "IN_PROGRESS", "LOW_LEVEL", "DAM_CAPACITY_LOW", "WATER_LEVEL_CRITICAL"]:
            if enum_val in line and not line.strip().startswith('import') and not 'case' in line:
                findings.append({
                    "line": idx,
                    "cat": 1,
                    "cat_name": "Category 1: Raw code or enum values shown to users",
                    "code": clean,
                    "desc": f"Raw enum value '{enum_val}' rendered in UI component"
                })
                
        # 2. Internal notes or spec references in the UI
        spec_m = spec_pattern.search(line)
        if spec_m:
            findings.append({
                "line": idx,
                "cat": 2,
                "cat_name": "Category 2: Internal notes or spec references in the UI",
                "code": clean,
                "desc": f"Internal spec reference '{spec_m.group(0)}' present in UI"
            })
            
        # 3. Marketing filler text
        if any(phrase in clean.lower() for phrase in ["empowering communities through smart water management", "telemetry excellence", "smart water management and real-time telemetry", "cutting-edge telemetry"]):
            findings.append({
                "line": idx,
                "cat": 3,
                "cat_name": "Category 3: Marketing filler text that doesn't say anything concrete",
                "code": clean,
                "desc": "Generic marketing filler text displayed in UI"
            })
            
        # 4. Text bugs (missing space, placeholder name, hardcoded driver name)
        if re.search(r'"Residence"|"Resident"|Sipho Ndlovu|TRK-001|DRV-101|John Doe|Driver #\d', line):
            if not 'const ' in line and not 'let ' in line and not 'type' in line and not 'function' in line:
                findings.append({
                    "line": idx,
                    "cat": 4,
                    "cat_name": "Category 4: Text bugs: missing spaces, truncated text, placeholder names or hardcoded driver names/IDs",
                    "code": clean,
                    "desc": "Hardcoded driver/truck name or placeholder name used in UI"
                })
        if re.search(r'>\w+:\$\{|\}\w+<|"[A-Za-z]+:"\s*\+', line):
            findings.append({
                "line": idx,
                "cat": 4,
                "cat_name": "Category 4: Text bugs: missing spaces, truncated text, placeholder names or hardcoded driver names/IDs",
                "code": clean,
                "desc": "Missing space in text string or template string concatenation"
            })
            
        # 5. Emoji used as icons
        emojis = [ch for ch in clean if ord(ch) in [0x1F4A0, 0x1F4A7, 0x1F69B, 0x1F6A8, 0x1F4CA, 0x26A0, 0x26FD, 0x2705, 0x274C, 0x2753, 0x2757, 0x1F6A6, 0x1F6A2, 0x1F69A, 0x1F697, 0x1F6E0, 0x1F4CB, 0x1F512, 0x1F511, 0x1F464, 0x1F4AC, 0x1F514, 0x2699, 0x1F300, 0x1F30A, 0x1F4C8, 0x1F6E1]]
        if emojis:
            findings.append({
                "line": idx,
                "cat": 5,
                "cat_name": "Category 5: Emoji used as icons, or icons from mixed sets / inconsistent sizes",
                "code": clean,
                "desc": f"Emoji character(s) '{''.join(emojis)}' used as UI icon"
            })
            
        # 7. All-caps badges and labels
        for ac in all_caps:
            if (f">{ac}<" in line or f"> {ac} <" in line or f"'{ac}'" in line or f'"{ac}"' in line) and ('Badge' in line or 'badge' in line or 'span' in line or 'td' in line or 'h2' in line or 'h3' in line or 'p' in line or 'div' in line):
                if not f"{ac}:" in line and not "const" in line:
                    findings.append({
                        "line": idx,
                        "cat": 7,
                        "cat_name": "Category 7: All-caps badges and labels that could be sentence case",
                        "code": clean,
                        "desc": f"ALL-CAPS label or badge text '{ac}' used"
                    })
                    
        # 9. Hardcoded hex colours, radii and font sizes
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

    # Category 8 (Duplicated UI checks)
    full_text = "".join(lines)
    if 'BrandLogo' in full_text and full_text.count('<BrandLogo') > 1:
        for lno, l in enumerate(lines, 1):
            if '<BrandLogo' in l:
                findings.append({
                    "line": lno,
                    "cat": 8,
                    "cat_name": "Category 8: Duplicated UI",
                    "code": l.strip(),
                    "desc": "Multiple <BrandLogo> components rendered in the same view/component"
                })
    if 'LanguageSwitcher' in full_text and full_text.count('<LanguageSwitcher') > 1:
        for lno, l in enumerate(lines, 1):
            if '<LanguageSwitcher' in l:
                findings.append({
                    "line": lno,
                    "cat": 8,
                    "cat_name": "Category 8: Duplicated UI",
                    "code": l.strip(),
                    "desc": "Multiple <LanguageSwitcher> components rendered in the same view/component"
                })

    if findings:
        report[rel_path] = findings

print(f"Generated findings for {len(report)} files out of {len(jsx_files)}.")

with open('scratch/report.json', 'w', encoding='utf-8') as out:
    json.dump(report, out, indent=2)
