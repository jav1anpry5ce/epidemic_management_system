export default function formatTrn(taxNumber) {
  if (!taxNumber.includes("-") || !taxNumber.includes("")) {
    var trn = taxNumber;
    var regexp = /^([^\s]{3})([^\s]{3})([^\s]{3})$/g;
    var match = regexp.exec(trn);
    if (match) {
      match.shift();
      trn = match.join("-");
      return trn;
    } else {
      return taxNumber;
    }
  } else {
    return taxNumber;
  }
}
