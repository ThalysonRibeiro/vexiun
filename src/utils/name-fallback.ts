export function nameFallback(value = "CATALYST"): string {
  const nameArray = value.trim().split(" ").filter(n => n.length > 0);

  if (nameArray.length === 0) {
    return "CA";
  } else if (nameArray.length === 1) {
    return nameArray[0].slice(0, 2).toUpperCase();
  } else {
    return (nameArray[0][0] + nameArray[1][0]).toUpperCase();
  }
}