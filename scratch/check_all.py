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

print(f"Total files: {len(jsx_files)}")

# Check duplicate UI usages across files
ui_components = ['BrandLogo', 'LanguageSwitcher', 'Footer', 'Sidebar']
ui_usages = {comp: [] for comp in ui_components}

for filepath in sorted(jsx_files):
    rel_path = os.path.relpath(filepath, 'frontend/src').replace('\\', '/')
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
        lines = content.splitlines()
        
    for comp in ui_components:
        if f'<{comp}' in content:
            # find line numbers
            for lno, line in enumerate(lines, 1):
                if f'<{comp}' in line:
                    ui_usages[comp].append((rel_path, lno, line.strip()))

print("=== UI Component Usages ===")
for comp, usages in ui_usages.items():
    print(f"Component <{comp}> rendered {len(usages)} times across codebase:")
    for rpath, lno, line in usages:
        print(f"  {rpath}:{lno} -> {line}")
