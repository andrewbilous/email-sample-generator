export const validateForm = (form) => {
  const errors = {
    to: !form.to.trim(),
    subject: !form.subject.trim()
  };

  const isValid = Object.values(errors).every((v) => !v);

  return { isValid, errors };
};