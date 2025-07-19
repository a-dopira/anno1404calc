export class XMLService {
  constructor() {
    this.parser = new DOMParser();
    this.serializer = new XMLSerializer();
  }

  exportToXML(data) {
    const xmlDoc = document.implementation.createDocument("", "", null);

    const root = xmlDoc.createElement("Anno1404Calculator");
    root.setAttribute("version", "1.0");
    root.setAttribute("exportDate", new Date().toISOString());
    xmlDoc.appendChild(root);

    const inhabitantsElement = xmlDoc.createElement("Inhabitants");
    data.inhabitants.forEach((count, index) => {
      if (count > 0) {
        const inhabitant = xmlDoc.createElement("Inhabitant");
        inhabitant.setAttribute("index", index);
        inhabitant.setAttribute("type", this.getInhabitantType(index));
        inhabitant.setAttribute("count", count);
        inhabitantsElement.appendChild(inhabitant);
      }
    });
    root.appendChild(inhabitantsElement);

    const multipliersElement = xmlDoc.createElement("Multipliers");
    data.multipliers.forEach((multiplier, index) => {
      if (multiplier > 0) {
        const multiplierEl = xmlDoc.createElement("Multiplier");
        multiplierEl.setAttribute("index", index);
        multiplierEl.setAttribute("goodType", this.getGoodType(index));
        multiplierEl.setAttribute("value", multiplier);
        multipliersElement.appendChild(multiplierEl);
      }
    });
    root.appendChild(multipliersElement);

    if (data.calculationResults && data.calculationResults.length > 0) {
      const resultsElement = xmlDoc.createElement("CalculationResults");
      data.calculationResults.forEach((amount, index) => {
        if (amount > 0) {
          const result = xmlDoc.createElement("ProductionNeed");
          result.setAttribute("index", index);
          result.setAttribute("goodType", this.getGoodType(index));
          result.setAttribute("amount", amount);
          resultsElement.appendChild(result);
        }
      });
      root.appendChild(resultsElement);
    }

    if (data.memorizedAmounts && data.memorizedAmounts.length > 0) {
      const memorizedElement = xmlDoc.createElement("MemorizedAmounts");
      data.memorizedAmounts.forEach((amount, index) => {
        if (amount > 0) {
          const memorized = xmlDoc.createElement("MemorizedAmount");
          memorized.setAttribute("index", index);
          memorized.setAttribute("goodType", this.getGoodType(index));
          memorized.setAttribute("amount", amount);
          memorizedElement.appendChild(memorized);
        }
      });
      root.appendChild(memorizedElement);
    }

    const metadataElement = xmlDoc.createElement("Metadata");
    metadataElement.setAttribute("calculatorVersion", "2.0");
    metadataElement.setAttribute("gameVersion", "Anno1404");
    root.appendChild(metadataElement);

    return this.serializer.serializeToString(xmlDoc);
  }

  importFromXML(xmlString) {
    try {
      const xmlDoc = this.parser.parseFromString(xmlString, "text/xml");

      const parserError = xmlDoc.querySelector("parsererror");
      if (parserError) {
        throw new Error("Invalid XML format: " + parserError.textContent);
      }

      const root = xmlDoc.documentElement;

      if (root.tagName !== "Anno1404Calculator") {
        throw new Error(
          "Invalid file format. Expected Anno1404Calculator root element.",
        );
      }

      const data = {
        inhabitants: new Array(7).fill(0),
        multipliers: new Array(21).fill(0),
        calculationResults: [],
        memorizedAmounts: [],
        metadata: {},
      };

      const inhabitantsElement = root.querySelector("Inhabitants");
      if (inhabitantsElement) {
        const inhabitants = inhabitantsElement.querySelectorAll("Inhabitant");
        inhabitants.forEach((inhabitant) => {
          const index = parseInt(inhabitant.getAttribute("index"));
          const count = parseInt(inhabitant.getAttribute("count"));
          if (index >= 0 && index < 7) {
            data.inhabitants[index] = count;
          }
        });
      }

      const multipliersElement = root.querySelector("Multipliers");
      if (multipliersElement) {
        const multipliers = multipliersElement.querySelectorAll("Multiplier");
        multipliers.forEach((multiplier) => {
          const index = parseInt(multiplier.getAttribute("index"));
          const value = parseInt(multiplier.getAttribute("value"));
          if (index >= 0 && index < 21) {
            data.multipliers[index] = value;
          }
        });
      }

      const resultsElement = root.querySelector("CalculationResults");
      if (resultsElement) {
        data.calculationResults = new Array(21).fill(0);
        const results = resultsElement.querySelectorAll("ProductionNeed");
        results.forEach((result) => {
          const index = parseInt(result.getAttribute("index"));
          const amount = parseInt(result.getAttribute("amount"));
          if (index >= 0 && index < 21) {
            data.calculationResults[index] = amount;
          }
        });
      }

      const memorizedElement = root.querySelector("MemorizedAmounts");
      if (memorizedElement) {
        data.memorizedAmounts = new Array(21).fill(0);
        const memorized = memorizedElement.querySelectorAll("MemorizedAmount");
        memorized.forEach((mem) => {
          const index = parseInt(mem.getAttribute("index"));
          const amount = parseInt(mem.getAttribute("amount"));
          if (index >= 0 && index < 21) {
            data.memorizedAmounts[index] = amount;
          }
        });
      }

      const metadataElement = root.querySelector("Metadata");
      if (metadataElement) {
        data.metadata = {
          calculatorVersion: metadataElement.getAttribute("calculatorVersion"),
          gameVersion: metadataElement.getAttribute("gameVersion"),
          exportDate: root.getAttribute("exportDate"),
        };
      }

      return data;
    } catch (error) {
      throw new Error("Failed to import XML: " + error.message);
    }
  }

  downloadXML(xmlContent, filename = "anno1404_calculation.xml") {
    const blob = new Blob([xmlContent], { type: "application/xml" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.style.display = "none";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  loadXML() {
    return new Promise((resolve, reject) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".xml";
      input.style.display = "none";

      input.onchange = (event) => {
        const file = event.target.files[0];
        if (!file) {
          reject(new Error("No file selected"));
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = this.importFromXML(e.target.result);
            resolve(data);
          } catch (error) {
            reject(error);
          }
        };
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsText(file);
      };

      input.oncancel = () => reject(new Error("File selection cancelled"));

      document.body.appendChild(input);
      input.click();
      document.body.removeChild(input);
    });
  }

  getInhabitantType(index) {
    const types = [
      "beggar",
      "peasant",
      "citizen",
      "patrician",
      "nobleman",
      "nomad",
      "envoy",
    ];
    return types[index] || "unknown";
  }

  getGoodType(index) {
    const types = [
      "fish",
      "spices",
      "bread",
      "meat",
      "cider",
      "beer",
      "wine",
      "linen_garments",
      "leather_jerkins",
      "fur_coats",
      "brocade_robes",
      "books",
      "candlesticks",
      "glasses",
      "dates",
      "milk",
      "carpets",
      "coffee",
      "pearl_necklaces",
      "parfumes",
      "marzipans",
    ];
    return types[index] || "unknown";
  }

  formatXML(xmlString) {
    const xmlDoc = this.parser.parseFromString(xmlString, "text/xml");
    return this.prettifyXML(xmlDoc.documentElement, 0);
  }

  prettifyXML(node, indent = 0) {
    const indentStr = "  ".repeat(indent);
    let result = indentStr + "<" + node.tagName;

    for (let attr of node.attributes) {
      result += ` ${attr.name}="${attr.value}"`;
    }

    if (node.children.length === 0 && !node.textContent.trim()) {
      result += " />\n";
    } else {
      result += ">\n";

      for (let child of node.children) {
        result += this.prettifyXML(child, indent + 1);
      }

      result += indentStr + "</" + node.tagName + ">\n";
    }

    return result;
  }

  validateXMLData(data) {
    const errors = [];

    if (!Array.isArray(data.inhabitants) || data.inhabitants.length !== 7) {
      errors.push("Invalid inhabitants data");
    }

    data.inhabitants.forEach((val, index) => {
      if (typeof val !== "number" || val < 0) {
        errors.push(`Invalid inhabitant value at index ${index}: ${val}`);
      }
    });

    return errors;
  }
}

export const xmlService = new XMLService();
