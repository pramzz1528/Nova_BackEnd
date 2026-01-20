exports.buildPrompt = ({ mode, language, code, message }) => {
  switch (mode) {
    case "CODE_REVIEW":
      return `
LANGUAGE: ${language}

TASK:
Review the following code carefully.

CODE:
${code}
      `;

    case "CODE_FIX":
      return `
LANGUAGE: ${language}

TASK:
Fix the issues in the following code.

CODE:
${code}

USER QUESTION:
${message}
      `;

    default:
      return message;
  }
};
