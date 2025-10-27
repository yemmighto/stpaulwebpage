// Function to convert numbers to words (Naira format)
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

// Helper for hundreds
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

// Convert to Title Case




function toTitleCase(str) {
  return str.replace(/\w\S*/g, (txt) => 
     txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
}

document.getElementById('generateBtn').addEventListener('click', () => {
  const title = document.getElementById('titleSelect').value;
  let rawName = document.getElementById('donorName').value.trim();

  const name = toTitleCase(rawName);
  
  const amount = document.getElementById('donationAmount').value.trim();
  const letterContent = document.getElementById('letterContent');
  const printBtn = document.getElementById('printBtn');

  if (!name || !amount) {
    alert("Please fill in the donor's name and amount donated.");
    return;
  }

  const today = new Date().toLocaleDateString();
  const amountInWordsRaw = numberToWords(parseInt(amount)) + " naira";
  const amountInWords = toTitleCase(amountInWordsRaw);

  const letter = 

  `${title} ${name},



I hope this letter finds you in good health and spirits.  On behalf of the Parish Church Council and the entire  congregation of St. Paul's Anglican Church, Ago-Iwoye, we extend our most  sincere gratitude for your generous financial donation  of 
 ${amountInWords}  (₦${amount}) toward the 
 launch of our Hostel Project. This initiative was officially unveiled during the New Church Chiefs' Investiture/Installation Ceremony held on October 12, 2025.

Please know that your support is more than a gift; it's a vital investment in the long-term financial stability of St. Paul's Church. Your generosity has provided the crucial capital needed to begin construction and bring this vision to life.

With deep gratitude, we thank you for walking alongside us. May God bless you abundantly and grant you peace in your endeavours.


 Sincerely,



Ven. Engr. ‘Tunbosun Olujuyitan
Vicar`;

  letterContent.textContent = letter;
  printBtn.style.display = "inline-block";
});

document.getElementById('printBtn').addEventListener('click', async () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  const letterText = document.getElementById('letterContent').textContent;
  const donorName = document.getElementById('donorName').value.trim() || "donor";

  const img = new Image();
  img.src = "images/letterhead.png"; // update with your image path

  img.onload = function() {
    const pageWidth = doc.internal.pageSize.getWidth();  // ~210mm for A4
    const leftMargin = 20;
    const rightMargin = 20;
    const usableWidth = pageWidth - leftMargin - rightMargin;

    const imgWidth = usableWidth;
    const imgHeight = 35;
    const marginTop = 10;

    // Add letterhead
    doc.addImage(img, "PNG", leftMargin, marginTop, imgWidth, imgHeight);

    // Set up top section (date + subtitle)
    let currentY = marginTop + imgHeight + 15;
    const today = new Date().toLocaleDateString();

    // Date (right-aligned)
    doc.setFont("Times", "Italic");
    doc.setFontSize(12);
    doc.text(today, pageWidth - rightMargin, currentY, { align: "right" });
    currentY += 10;

    // Subtitle
    doc.setFont("Times", "Bold");
    doc.setFontSize(15);
    doc.text("FORMAL ACKNOWLEDGMENT AND APPRECIATION FOR \nINVESTING IN OUR HOSTEL PROJECT", pageWidth / 2, currentY, { align: "center" });
    currentY += 15;

    // Main Letter Text
    doc.setFont("Times", "Roman");
    doc.setFontSize(12);
    doc.setTextColor(30, 30, 30);
    doc.setLineHeightFactor(1.5);  // Normal spacing

    // Wrap and justify text
    const lines = doc.splitTextToSize(letterText.trim(), usableWidth);
    doc.text(lines, leftMargin, currentY, { align: "left" });

  

    // Save PDF
    doc.save(`Donation_ThankYou_${donorName}.pdf`);
  };
});








  
