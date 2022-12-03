import React, { useEffect, useRef, useState } from 'react';
import styles from './select.module.css';

export interface SelectOption {
    value: string | number
    label: string
}

interface SingleSelectProps {
    multiple?: false
    value?: SelectOption
    onChange: (value: SelectOption | undefined) => void
}

interface MultipleSelectProps {
    multiple: true
    value: SelectOption[]
    onChange: (value: SelectOption[]) => void
}

type SelectProps = {
    options: SelectOption[]
} & (SingleSelectProps | MultipleSelectProps)

const Select: React.FC<SelectProps> = ({ multiple, value, onChange, options }) => {

    const [isOpen, setIsOpen] = useState(false)
    const [highlightedIndex, setHighlightedIndex] = useState(0)
    const containerRef = useRef<HTMLDivElement>(null)

    const clearOptions = (evt: React.MouseEvent<HTMLButtonElement>) => {
        evt.stopPropagation()
        multiple ? onChange([]) : onChange(undefined)
    }

    const selectOption = (option: SelectOption, evt?: React.MouseEvent<HTMLLIElement | HTMLButtonElement>) => {
        evt?.stopPropagation()
        if (multiple) {
            if (value?.includes(option)) {
                onChange(value.filter(opt => opt.value !== option.value))
            } else {
                onChange([...value, option])
            }
        } else {
            if (option.value === value?.value) return
            onChange(option)
        }
        setIsOpen(false)
    }

    const isOptionSelected = (option: SelectOption) => {
        return multiple ? value?.includes(option) : option === value
    }

    useEffect(() => {
        if (isOpen) setHighlightedIndex(0)
    }, [isOpen])

    useEffect(() => {
        const handler = (evt: KeyboardEvent) => {
            if (evt.target != containerRef.current) return
            switch (evt.code) {
                case "Enter":
                case "Space":
                    setIsOpen(prev => !prev)
                    if (isOpen) selectOption(options[highlightedIndex])
                    break
                case "ArrowUp":
                case "ArrowDown": {
                    if (!open) {
                        setIsOpen(true)
                        break
                    }
                    const newValue = highlightedIndex + (evt.code === "ArrowDown" ? 1 : -1)
                    if (newValue >= 0 && newValue < options.length) {
                        setHighlightedIndex(newValue)
                    }
                    break
                }
                case "Escape":
                    setIsOpen(false)
                    break
            }
        }
        containerRef.current?.addEventListener("keydown", handler)
        return () => {
            containerRef.current?.removeEventListener("keydown", handler)
        }
    }, [isOpen, highlightedIndex, options])

    return (
        <div
            ref={containerRef}
            tabIndex={0}
            className={styles.container}
            onBlur={() => setIsOpen(false)}
            onClick={() => setIsOpen(prev => !prev)}
        >
            <span className={styles.value}>{multiple ? value?.map(v => (
                <button
                    key={v.value}
                    className={styles["option-badge"]}
                    onClick={evt => selectOption(v, evt)}
                >
                    {v.label}
                    <span className={styles["remove-btn"]}>
                        &times;
                    </span>
                </button>
            )) : value?.label}</span>
            <button
                className={styles["clear-btn"]}
                onClick={evt => clearOptions(evt)}
            >
                &times;
            </button>
            <div className={styles.divider} />
            <div className={styles.caret} />
            <ul className={`${styles.options} ${isOpen ? styles.show : ''}`}>
                {options.map((option, index) => (
                    <li
                        key={option.value}
                        className={`
                        ${styles.option} 
                        ${isOptionSelected(option) ? styles.selected : ''}
                        ${index === highlightedIndex ? styles.highlighted : ''}
                    `}
                        onMouseEnter={() => setHighlightedIndex(index)}
                        onClick={evt => selectOption(option, evt)}
                    >
                        {option.label}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Select;