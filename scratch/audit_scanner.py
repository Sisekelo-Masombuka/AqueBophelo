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

print(f"Total JSX files to scan: {len(jsx_files)}")

spec_pattern = re.compile(r'\(Section\s*[\d\.]+\)|\(Item\s*[\d\.]+\)|\(Req\s*[\d\.]+\)', re.IGNORECASE)
hex_pattern = re.compile(r'#[0-9a-fA-F]{3,8}')
arbitrary_tailwind_pattern = re.compile(r'(rounded-\[\d+px\]|text-\[\d+px\]|bg-\[#[0-9a-fA-F]{3,8}\]|text-\[#[0-9a-fA-F]{3,8}\]|border-\[#[0-9a-fA-F]{3,8}\]|shadow-\[.*?\])')

all_caps_badges = ['HEALTHY', 'CRITICAL', 'ON TRIP', 'PENDING', 'COMPLETED', 'DISPATCHED', 'IN PROGRESS', 'ACTIVE', 'INACTIVE', 'LOW LEVEL', 'NORMAL', 'HIGH', 'MEDIUM', 'LOW', 'URGENT', 'ONLINE', 'OFFLINE', 'RESOLVED', 'OPEN', 'IN MAINTENANCE']

report = {}

for filepath in sorted(jsx_files):
    rel_path = os.path.relpath(filepath, '.').replace('\\', '/')
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        lines = f.readlines()
        
    findings = []
    
    for idx, line in enumerate(lines, 1):
        clean_line = line.strip()
        if not clean_line or clean_line.startswith('//') or clean_line.startswith('/*') or clean_line.startswith('*'):
            continue

        # Cat 1: Raw code or enum values shown to users
        for r_enum in ['ONTRIP', 'IN_PROGRESS', 'ON_TRIP', 'OnTrip', 'LOW_LEVEL', 'DAM_CAPACITY_LOW', 'WATER_LEVEL_CRITICAL']:
            if r_enum in line and not line.strip().startswith('import'):
                findings.append({'line': idx, 'cat': 1, 'desc': f"Raw enum string '{r_enum}' used", 'code': clean_line})
                
        # Cat 2: Internal notes / spec references
        spec_match = spec_pattern.search(line)
        if spec_match:
            findings.append({'line': idx, 'cat': 2, 'desc': f"Internal spec reference: {spec_match.group(0)}", 'code': clean_line})
            
        # Cat 3: Marketing filler text
        if any(phrase in clean_line.lower() for phrase in ['empowering communities', 'telemetry excellence', 'smart water management']):
            findings.append({'line': idx, 'cat': 3, 'desc': "Marketing filler text", 'code': clean_line})
            
        # Cat 4: Text bugs / placeholders / hardcoded names
        if re.search(r'"Residence"|"Resident"|Sipho Ndlovu|TRK-001|DRV-101|John Doe|Driver #\d', line):
            if not 'const' in line and not 'let' in line:
                findings.append({'line': idx, 'cat': 4, 'desc': "Hardcoded driver name / placeholder used in UI", 'code': clean_line})
                
        # Cat 5: Emoji used as icons
        for ch in clean_line:
            code_pt = ord(ch)
            if code_pt in [0x1F4A0, 0x1F4A7, 0x1F69B, 0x1F6A8, 0x1F4CA, 0x26A0, 0x26FD, 0x2705, 0x274C, 0x2753, 0x2757, 0x1F6A6, 0x1F6A2, 0x1F69A, 0x1F697, 0x1F6E0, 0x1F4CB, 0x1F512, 0x1F511, 0x1F464, 0x1F4AC, 0x1F514, 0x2699]:
                findings.append({'line': idx, 'cat': 5, 'desc': f"Emoji '{ch}' used as icon", 'code': clean_line})
                break
                
        # Cat 7: All-caps badges / text
        for ac in all_caps_badges:
            if (f'>{ac}<' in line or f'> {ac} <' in line or f"'{ac}'" in line or f'"{ac}"' in line) and ('Badge' in line or 'badge' in line or 'span' in line or 'td' in line or 'p' in line or 'div' in line):
                findings.append({'line': idx, 'cat': 7, 'desc': f"All-caps badge/label text '{ac}'", 'code': clean_line})
                
        # Cat 9: Hardcoded hex, radii, font sizes
        arb_matches = arbitrary_tailwind_pattern.findall(line)
        if arb_matches:
            findings.append({'line': idx, 'cat': 9, 'desc': f"Hardcoded Tailwind arbitrary value: {', '.join(arb_matches)}", 'code': clean_line})
        elif hex_pattern.search(line) and not line.strip().startswith('import'):
            hexes = hex_pattern.findall(line)
            findings.append({'line': idx, 'cat': 9, 'desc': f"Hardcoded hex colour: {', '.join(hexes)}", 'code': clean_line})

    if findings:
        report[rel_path] = findings

with open('scratch/scan_summary.json', 'w', encoding='utf-8') as f_out:
    json.dump(report, f_out, indent=2)

print(f"Summary generated for {len(report)} files.")
