import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
export type LegalPackData = {
  reportId: string; createdAtISO: string; reporterSummary: string;
  tags: string[]; severity: number; urgency: "low"|"medium"|"high"|"immediate";
  sha256: string; anchorTxHash?: string; anchorExplorer?: string;
  location?: string; resources?: { name: string; contact?: string }[];
  nearestResources?: { name: string; contact?: string; distanceKm?: number }[];
};
export async function generateLegalPackPDF(data: LegalPackData): Promise<Blob> {
  const pdf = await PDFDocument.create(); const page = pdf.addPage([612, 792]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const margin = 50; let y = 742;
  const write = (label:string, value:string, wrap=true) => {
    page.drawText(label, { x: margin, y, size: 12, font: bold, color: rgb(0.1,0.1,0.1) }); y -= 16;
    const lines = wrap ? wrapText(value, 80) : [value];
    for (const ln of lines){ page.drawText(ln, { x: margin, y, size: 11, font, color: rgb(0.15,0.15,0.15) }); y-=14; if (y<80) y=742; }
    y -= 6;
  };
  const wrapText = (t:string,w:number)=>{ const words=(t||"").split(/\s+/); const lines:string[]=[]; let line="";
    for(const wd of words){ if((line+" "+wd).trim().length>w){lines.push(line.trim()); line=wd;} else line+=" "+wd; }
    if(line.trim()) lines.push(line.trim()); return lines; };
  page.drawText("SafeSpeak Legal Pack", { x: margin, y, size: 16, font: bold, color: rgb(0,0.2,0.5) }); y -= 22;
  write("Report ID:", data.reportId, false);
  write("Created At:", data.createdAtISO, false);
  write("Summary:", data.reporterSummary || "(not provided)");
  write("Tags:", (data.tags||[]).join(", ") || "(none)", false);
  write("Severity:", String(data.severity), false);
  write("Urgency:", data.urgency, false);
  if (data.location) write("Location:", data.location);
  write("Evidence Hash (SHA-256):", data.sha256, false);
  if (data.anchorTxHash) { const link = `${data.anchorExplorer || "https://sepolia.etherscan.io/tx/"}${data.anchorTxHash}`; write("Blockchain Anchor:", link); }
  else write("Blockchain Anchor:", "Not available");
  if (data.nearestResources?.length) {
    const nearestText = data.nearestResources.slice(0, 3).map(r => {
      const dist = r.distanceKm !== undefined ? ` — ${r.distanceKm.toFixed(1)} km` : '';
      const contact = r.contact ? ` — ${r.contact}` : '';
      return `• ${r.name}${contact}${dist}`;
    }).join("\n");
    write("Nearby support (based on your location):", nearestText);
  }
  if (data.resources?.length){ write("Relevant Resources:", data.resources.map(r=>`• ${r.name}${r.contact?` (${r.contact})`:""}`).join("\n")); }
  const bytes = await pdf.save(); return new Blob([bytes], { type: "application/pdf" });
}
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob); const a = document.createElement("a");
  a.href = url; a.download = filename; a.click(); URL.revokeObjectURL(url);
}