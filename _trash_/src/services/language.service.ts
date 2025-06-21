import enDictionary from "../assets/lang/en.json";
import { vocabulary } from "../types.d";

class LanguageService {
  private _dictionary: vocabulary = {};

  public constructor() {
    switch (this.getCurrentLanguage()) {
      /// TODO anothe langs
      case "ua":
      default:
        this._dictionary = enDictionary;
        break;
    }
  }

  public get dictionary(): vocabulary {
    return this._dictionary;
  }

  public updateDictionary(newDictionary: vocabulary) {
    this._dictionary = newDictionary;
  }

  public getCurrentLanguage(): string {
    return "en";
  }
}

const languageService = new LanguageService();

export default languageService;
