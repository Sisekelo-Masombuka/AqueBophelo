import json

with open("scratch/final_audit_summary.json", "r", encoding="utf-8") as f:
    data = json.load(f)

lines = []
lines.append("# React JSX Comprehensive Codebase Audit Report\n")
lines.append("**Scope**: `frontend/src/` (excluding `components/LiveMap.jsx`)\n")
lines.append("**Total Files Audited**: 73 JSX/React Files\n")
lines.append("\n---\n")

total_issues = 0
files_with_issues = 0

for file_path, findings in data.items():
    if not findings:
        continue
    files_with_issues += 1
    total_issues += len(findings)
    lines.append(f"### File: `{file_path}` ({len(findings)} findings)\n")
    
    # Sort findings by line number
    sorted_findings = sorted(findings, key=lambda x: x["line"])
    
    for item in sorted_findings:
        lno = item["line"]
        cat = item["cat"]
        cat_name = item["cat_name"]
        desc = item["desc"]
        code = item["code"]
        lines.append(f"- **Line {lno}** | [{cat_name}]")
        lines.append(f"  - *Finding*: {desc}")
        lines.append(f"  - *Snippet*: `{code}`\n")

lines.insert(4, f"**Files with Audit Findings**: {files_with_issues} / 73\n**Total Issues Cataloged**: {total_issues}\n")

with open("scratch/audit_report.md", "w", encoding="utf-8") as f_out:
    f_out.write("\n".join(lines))

print(f"Formatted report saved to scratch/audit_report.md with {total_issues} issues in {files_with_issues} files.")
