/**
 * 翻译工具函数
 * 使用 MyMemory Translation API（免费，无需注册）
 */

export interface TranslationResult {
  translatedText: string;
  sourceLang: string;
  targetLang: string;
}

/**
 * 翻译文本
 * @param text 要翻译的文本
 * @param targetLang 目标语言代码（例如：zh, en, es, fr, de, ru, ar, ja, ko）
 * @param sourceLang 源语言代码（可选，自动检测）
 * @returns 翻译结果
 */
export async function translateText(
  text: string,
  targetLang: string = 'en',
  sourceLang: string = 'auto'
): Promise<TranslationResult> {
  try {
    if (!text || text.trim() === '') {
      return {
        translatedText: text,
        sourceLang,
        targetLang,
      };
    }

    // MyMemory Translation API
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      text
    )}&langpair=${sourceLang}|${targetLang}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.responseStatus === 200 && data.responseData) {
      return {
        translatedText: data.responseData.translatedText,
        sourceLang: data.responseData.detectedLanguage || sourceLang,
        targetLang,
      };
    } else {
      console.error('翻译失败:', data);
      // 如果翻译失败，返回原文
      return {
        translatedText: text,
        sourceLang,
        targetLang,
      };
    }
  } catch (error) {
    console.error('翻译错误:', error);
    // 如果出错，返回原文
    return {
      translatedText: text,
      sourceLang,
      targetLang,
    };
  }
}

/**
 * 批量翻译
 * @param texts 文本数组
 * @param targetLang 目标语言
 * @returns 翻译结果数组
 */
export async function translateBatch(
  texts: string[],
  targetLang: string = 'en'
): Promise<TranslationResult[]> {
  const results = await Promise.all(
    texts.map((text) => translateText(text, targetLang))
  );
  return results;
}

/**
 * 支持的语言列表
 */
export const SUPPORTED_LANGUAGES = [
  { code: 'zh-CN', name: '中文（简体）' },
  { code: 'zh-TW', name: '中文（繁体）' },
  { code: 'en', name: '英语' },
  { code: 'es', name: '西班牙语' },
  { code: 'fr', name: '法语' },
  { code: 'de', name: '德语' },
  { code: 'ru', name: '俄语' },
  { code: 'ar', name: '阿拉伯语' },
  { code: 'ja', name: '日语' },
  { code: 'ko', name: '韩语' },
  { code: 'pt', name: '葡萄牙语' },
  { code: 'it', name: '意大利语' },
  { code: 'hi', name: '印地语' },
  { code: 'vi', name: '越南语' },
  { code: 'th', name: '泰语' },
];

/**
 * 获取语言名称
 * @param code 语言代码
 * @returns 语言名称
 */
export function getLanguageName(code: string): string {
  const lang = SUPPORTED_LANGUAGES.find((l) => l.code === code);
  return lang ? lang.name : code;
}
