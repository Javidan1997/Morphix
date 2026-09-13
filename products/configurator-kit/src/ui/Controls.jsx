/**
 * Renders the control panel straight from the option list.
 *
 * There is no per-product UI code: add an option to the config and its control
 * appears here, correctly labelled and wired.
 */
export default function Controls({ options, state, onChange }) {
  return (
    <div className="cfg-controls">
      {options.map(option => (
        <div className="cfg-field" key={option.id}>
          <Control option={option} value={state[option.id]} onChange={onChange} />
          {option.help && <p className="cfg-help">{option.help}</p>}
        </div>
      ))}
    </div>
  );
}

function Control({ option, value, onChange }) {
  switch (option.type) {
    case 'swatch':
      return (
        <fieldset className="cfg-swatches">
          <legend>{option.label}</legend>
          <div>
            {option.choices.map(choice => (
              <button
                key={choice.id}
                type="button"
                aria-pressed={value === choice.id}
                aria-label={choice.label}
                onClick={() => onChange(option.id, choice.id)}
              >
                <span style={{ background: choice.color || '#ccc' }} />
                <small>{choice.label}</small>
              </button>
            ))}
          </div>
        </fieldset>
      );

    case 'select':
      return (
        <fieldset className="cfg-segmented">
          <legend>{option.label}</legend>
          <div>
            {option.choices.map(choice => (
              <button
                key={choice.id}
                type="button"
                aria-pressed={value === choice.id}
                onClick={() => onChange(option.id, choice.id)}
              >
                {choice.label}
              </button>
            ))}
          </div>
        </fieldset>
      );

    case 'toggle':
      return (
        <label className="cfg-toggle">
          <span>{option.label}</span>
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={event => onChange(option.id, event.target.checked)}
          />
          <span className="cfg-switch" aria-hidden="true" />
        </label>
      );

    case 'range':
      return (
        <label className="cfg-range" htmlFor={`cfg-${option.id}`}>
          <span>
            {option.label}
            <output>{formatRange(value, option)}</output>
          </span>
          <input
            id={`cfg-${option.id}`}
            type="range"
            min={option.min}
            max={option.max}
            step={option.step}
            value={value}
            onChange={event => onChange(option.id, Number(event.target.value))}
          />
        </label>
      );

    default:
      return null;
  }
}

function formatRange(value, option) {
  const decimals = option.step < 1 ? String(option.step).split('.')[1]?.length ?? 1 : 0;
  return `${Number(value).toFixed(decimals)}${option.unit ? ` ${option.unit}` : ''}`;
}
