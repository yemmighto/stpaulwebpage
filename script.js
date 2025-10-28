// ===== Function to convert numbers to words (Naira format) =====
function numberToWords(num) {
    const a = [
        "", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
        "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen",
        "seventeen", "eighteen", "nineteen"
    ];
    const b = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

    if ((num = num.toString()).length > 9) return "overflow";
    let n = ("000000000" + num).substr(-9).match(/^(\d{3})(\d{3})(\d{3})$/);
    if (!n) return;

    let str = "";
    str += (n[1] != 0) ? (numberToWords(parseInt(n[1])) + " million ") : "";
    str += (n[2] != 0) ? (numberToWords(parseInt(n[2])) + " thousand ") : "";
    str += (n[3] != 0) ? (convertHundreds(parseInt(n[3]))) : "";
    return str.trim();
}

// ===== Helper for hundreds =====
function convertHundreds(num) {
    const a = [
        "", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
        "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen",
        "seventeen", "eighteen", "nineteen"
    ];
    const b = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

    if (num < 20) return a[num];
    if (num < 100) return b[Math.floor(num / 10)] + (num % 10 ? "-" + a[num % 10] : "");
    return a[Math.floor(num / 100)] + " hundred" + (num % 100 == 0 ? "" : " and " + convertHundreds(num % 100));
}

// ===== Convert to Title Case =====
function toTitleCase(str) {
    return str.replace(/\w\S*/g, (txt) =>
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
}

// ===== Calculate Max Line Length Dynamically =====
function getMaxCharsPerLine(doc, fontSize = 12, leftMargin = 30, rightMargin = 30) {
    const pageWidth = doc.internal.pageSize.getWidth();
    const usableWidth = pageWidth - leftMargin - rightMargin;
    const avgCharWidth = fontSize * 0.5; // based on Times Roman 12pt
    return Math.floor(usableWidth / avgCharWidth);
}

// ===== Wrap Long Text Based on Max Length =====
function wrapTextByLength(text, maxLength) {
    if (!text) return "";
    const regex = new RegExp(`(.{1,${maxLength}})(\\s|$)`, "g");
    return text.match(regex).join("\n").trim();
}

// ===== Generate Letter =====
document.getElementById('generateBtn').addEventListener('click', () => {
    const title = document.getElementById('titleSelect').value;
    const rawName = document.getElementById('donorName').value.trim();
    const name = toTitleCase(rawName);
    const amount = document.getElementById('donationAmount').value.trim();
    const letterContent = document.getElementById('letterContent');
    const printBtn = document.getElementById('printBtn');

    if (!name || !amount) {
        alert("Please fill in the donor's name and amount donated.");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: "pt", format: "a4" });

    const nairaSymbol = "\u0023";
    const amountInWordsRaw = numberToWords(parseInt(amount)) + " naira";
    const amountInWords = toTitleCase(amountInWordsRaw);
    const maxChars = getMaxCharsPerLine(doc, 12, 30, 30);
    const amountInWordsWrapped = wrapTextByLength(amountInWords, maxChars);

    const letter = ` ${name},

I hope this letter finds you in good health and spirits. On behalf of the Parish Church Council and the entire congregation of St. Paul's Anglican Church, Ago-Iwoye, we extend our most sincere gratitude for your generous financial donation of ${nairaSymbol} ${amount}  (${amountInWordsWrapped}) toward the launch of our Hostel Project. This initiative was officially unveiled during the New Church Chiefs’ Investiture/Installation Ceremony held on October 12, 2025.

Please know that your support is more than a gift; it’s a vital investment in the long-term financial stability of St. Paul's Church. Your generosity has provided the crucial capital needed to begin construction and bring this vision to life.

With deep gratitude, we thank you for walking alongside us. May God bless you abundantly and grant you peace in your endeavours.

Sincerely,

Ven. Engr. ‘Tunbosun Olujuyitan  
Vicar`;

    letterContent.textContent = letter;
    printBtn.style.display = "inline-block";
});

// ===== Generate PDF =====
document.getElementById('printBtn').addEventListener('click', async() => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: "pt", format: "a4" });

    const letterText = document.getElementById('letterContent').textContent.trim();
    const donorName = document.getElementById('donorName').value.trim() || "donor";
    const img = new Image();
    img.src = "images/letterhead.png"; // your image path

    const signatureImg = new Image();
    signatureImg.src = "images/signature.png"; // path to your signature image

    img.onload = function() {
        const pageWidth = doc.internal.pageSize.getWidth();
        const leftMargin = 50;
        const rightMargin = 50;
        const usableWidth = pageWidth - leftMargin - rightMargin;
        const imgHeight = 35;
        const marginTop = 15;

        // === Letterhead ===
        doc.addImage(img, "PNG", leftMargin, marginTop, usableWidth, imgHeight);

        // === Date ===
        let currentY = marginTop + imgHeight + 25;
        const today = new Date().toLocaleDateString();
        doc.setFont("Times", "Italic");
        doc.setFontSize(12);
        doc.text(today, pageWidth - rightMargin, currentY, { align: "right" });
        currentY += 20;

        // === Subtitle ===
        doc.setFont("Times", "Bold");
        doc.setFontSize(14);
        doc.text("FORMAL ACKNOWLEDGMENT AND APPRECIATION FOR", pageWidth / 2, currentY, { align: "center" });
        currentY += 18;
        doc.text("INVESTING IN OUR HOSTEL PROJECT", pageWidth / 2, currentY, { align: "center" });
        currentY += 30;

        // === Letter Body (Justified) ===
        doc.setFont("Times", "Roman");
        doc.setFontSize(12);
        doc.setTextColor(30, 30, 30);
        doc.setLineHeightFactor(1.6);

        const lines = doc.splitTextToSize(letterText, usableWidth);

        lines.forEach((line, i) => {
            if (i === lines.length - 1 || line.trim().endsWith(".")) {
                doc.text(line, leftMargin, currentY, { align: "left" }); // last line: normal left align
            } else {
                const words = line.split(/\s+/);
                const spaceCount = words.length - 1;
                if (spaceCount > 0) {
                    const textWidth = words.reduce((w, word) => w + doc.getTextWidth(word), 0);
                    let extraSpace = (usableWidth - textWidth) / spaceCount;
                    if (extraSpace > 8) extraSpace = 8; // avoid over-stretching
                    let x = leftMargin;
                    words.forEach((word, j) => {
                        doc.text(word, x, currentY);
                        x += doc.getTextWidth(word) + extraSpace;
                    });
                } else {
                    doc.text(line, leftMargin, currentY);
                }
            }
            currentY += 18; // consistent line spacing
        });

        // === Signature Section ===
        currentY += 10;
        doc.text("Sincerely,", leftMargin, currentY);
        currentY += 10;

        // === Signature Image ===
        signatureImg.onload = function() {
            const sigWidth = 100;
            const sigHeight = 50;
            doc.addImage(signatureImg, "PNG", leftMargin, currentY, sigWidth, sigHeight);
            currentY += sigHeight + 5;

            // === Signatory Text ===
            doc.setFont("Times", "Bold");
            doc.text("Ven. Engr. ‘Tunbosun Olujuyitan", leftMargin, currentY);
            doc.setFont("Times", "Roman");
            doc.text("Vicar", leftMargin, currentY + 15);

            // === Save PDF ===
            doc.save(`Donation_ThankYou_${donorName}.pdf`);
        };
    };
});