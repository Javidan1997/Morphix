function formatFieldLabel(key) {
  return key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function createEmptyValueFromTemplate(template) {
  if (Array.isArray(template)) return [];
  if (template && typeof template === "object") {
    return Object.fromEntries(
      Object.entries(template)
        .filter(([key]) => key !== "assetId")
        .map(([key, value]) => [key, createEmptyValueFromTemplate(value)]),
    );
  }
  if (typeof template === "boolean") return false;
  if (typeof template === "number") return 0;
  return "";
}

function isMultilineText(value) {
  return typeof value === "string" && (value.includes("\n") || value.length > 90);
}

function AdminContentField({
  fieldKey,
  value,
  onChange,
  depth = 0,
  rootLabel,
}) {
  if (fieldKey === "assetId") {
    return null;
  }

  const label = rootLabel ?? formatFieldLabel(fieldKey);

  if (Array.isArray(value)) {
    const template = value[0] ?? "";
    const itemLabel = `${label} item`;

    return (
      <div className={`admin-editor-block is-array depth-${depth}`}>
        <div className="admin-editor-array-head">
          <div>
            <strong>{label}</strong>
            <span>{value.length} items</span>
          </div>
          <button
            className="secondary-button admin-editor-action"
            type="button"
            onClick={() => onChange([...value, createEmptyValueFromTemplate(template)])}
          >
            Add item
          </button>
        </div>

        <div className="admin-editor-array-list">
          {value.map((item, index) => (
            <div className="admin-editor-array-item" key={`${fieldKey}-${index}`}>
              <div className="admin-editor-item-head">
                <span>{itemLabel} {index + 1}</span>
                <button
                  className="admin-editor-link"
                  type="button"
                  onClick={() => onChange(value.filter((_, itemIndex) => itemIndex !== index))}
                >
                  Remove
                </button>
              </div>

              <AdminContentField
                fieldKey={`${fieldKey}-${index}`}
                rootLabel={typeof item === "object" && item !== null ? item.title || item.label || item.name || `${label} item ${index + 1}` : `${label} item ${index + 1}`}
                value={item}
                depth={depth + 1}
                onChange={(nextItem) => onChange(
                  value.map((currentItem, itemIndex) => (itemIndex === index ? nextItem : currentItem)),
                )}
              />
            </div>
          ))}

          {!value.length ? (
            <div className="admin-editor-empty">
              <p>No items yet. Add the first one to start editing this list.</p>
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  if (value && typeof value === "object") {
    return (
      <div className={`admin-editor-block is-object depth-${depth}`}>
        <div className="admin-editor-group-head">
          <strong>{label}</strong>
        </div>

        <div className="admin-editor-group-body">
          {Object.entries(value).map(([childKey, childValue]) => (
            <AdminContentField
              key={childKey}
              fieldKey={childKey}
              value={childValue}
              depth={depth + 1}
              onChange={(nextValue) => onChange({
                ...value,
                [childKey]: nextValue,
              })}
            />
          ))}
        </div>
      </div>
    );
  }

  if (typeof value === "boolean") {
    return (
      <label className="admin-editor-checkbox">
        <input
          type="checkbox"
          checked={value}
          onChange={(event) => onChange(event.target.checked)}
        />
        <span>{label}</span>
      </label>
    );
  }

  if (typeof value === "number") {
    return (
      <label className="form-field admin-editor-field">
        {label}
        <input
          type="number"
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
        />
      </label>
    );
  }

  return (
    <label className="form-field admin-editor-field">
      {label}
      {isMultilineText(value) ? (
        <textarea
          rows="4"
          value={value ?? ""}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <input
          type="text"
          value={value ?? ""}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </label>
  );
}

export default AdminContentField;
