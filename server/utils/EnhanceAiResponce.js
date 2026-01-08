export function cleanAIResponse(text) {
  return text
    // remove <s> </s>
    .replace(/<\/?s>/gi, "")

    // remove [s] [/s]
    .replace(/\[\/?s\]/gi, "")

    // remove [INST] [/INST]
    .replace(/\[\/?INST\]/gi, "")

    // ✅ remove [OUT] and [/OUT] ANYWHERE
    .replace(/\[\/?OUT\]/gi, "")
      .replace(/###.*$/gis, "")   // remove everything after ###
    .replace(/\*\*.*?\*\*/g, "") // remove **bold meta**

    .trim();
}
