import React, { useEffect, useRef, useState } from 'react';
import styles from './select.module.css';

interface SingleSelectOption {
    value: string | number
    label: string
}

interface SingleSelectProps {
    value?: SingleSelectOption
    onChange: (value: SingleSelectOption | undefined) => void
    options: SingleSelectOption[]
}

const SingleSelect: React.FC<SingleSelectProps> = ({ value, onChange, options }) => {

    const [isOpen, setIsOpen] = useState(false)
    const [highlightedIndex, setHighlightedIndex] = useState(0)
    const containerRef = useRef<HTMLDivElement>(null)

    const clearOptions = (evt: React.MouseEvent<HTMLButtonElement>) => {
        evt.stopPropagation()
        onChange(undefined)
    }

    const selectOption = (option: SingleSelectOption, evt?: React.MouseEvent<HTMLLIElement | HTMLButtonElement>) => {
        evt?.stopPropagation()
        if (option.value === value?.value) return
        onChange(option)
        setIsOpen(false)
    }

    const isOptionSelected = (option: SingleSelectOption) => {
        return option === value
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
                    if (!isOpen) {
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
            <span className={styles.value}>
                {value?.label}
            </span>
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

export default SingleSelect;