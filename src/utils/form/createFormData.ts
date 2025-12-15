type FormFields = {
  [key: string]: string | number | boolean | File | string[] | undefined | null;
};

export function createFormData(formFields: FormFields) {
  const formData = new FormData();

  for (const field in formFields) {
    if (formFields[field] === null || formFields[field] === undefined) {
      continue;
    }
    if (Array.isArray(formFields[field])) {
      formFields[field].forEach((value, index) => {
        formData.append(`${field}[${index}]`, String(value));
      });
    } else if (formFields[field] instanceof File) {
      formData.append(field, formFields[field]);
    } else {
      formData.append(field, String(formFields[field]));
    }
  }

  return formData;
}
