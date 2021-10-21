function pad(pad: string, num: number, padLeft: boolean) {
  if (padLeft) {
    return (pad + num).slice(-pad.length);
  } else {
    return (num + pad).substring(0, pad.length);
  }
}

export function formatTimeFromPosition(position: number) {
  const milliseconds = Math.floor(position % 1000);
  const seconds = Math.floor((position % 60000) / 1000);
  const mins = Math.floor(position / 60000);
  if (mins === 0) {
    return `${pad("00", seconds, true)} : ${pad("000", milliseconds, true)}`;
  }
  return `${mins} : ${pad("00", seconds, true)} : ${pad(
    "000",
    milliseconds,
    true
  )}`;
}
