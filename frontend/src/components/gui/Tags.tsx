import { useEffect, useState } from "react";

export type TagProps = {
    tags : string[];
    tagLoader:()=>Promise<{ [key: string]: string }[]>;
    handleChange: (field: string, value: string | number | string[]) => void;
}
const Tags = ({tags,  tagLoader, handleChange}: TagProps) => {
    const [allTags, setAllTags] = useState<{ [key: string]: string }[]>([]);
    const loadTags = async () => {
        const t = await tagLoader();
        setAllTags(t);
      }
      useEffect(() => {
        loadTags();
      }, []);
    
      // בחירת קטגוריות עד 3
      const toggleTag = (tag: string) => {
    
        const exists = tags.includes(tag);
        if (exists) return handleChange('tags', tags.filter(t => t !== tag))
    
        if (tags.length >= 3) return;               // מגבלה עד 3
    
        handleChange('tags', [...tags, tag])
      };
      const removeTag = (tag: string) => handleChange('tags', tags.filter(t => t !== tag));
    return (
        <>
            {/* <span className="section-title">בחירת קטגוריות</span> */}
            <div className="cc-chips">
                {allTags.map(({ tag }) => {
                    const selected = tags.includes(tag);
                    const disabled = !selected && tags.length >= 3;
                    return (
                        <button
                            key={tag}
                            type="button"
                            className={`cc-chip ${selected ? 'is-selected' : ''} ${disabled ? 'is-disabled' : ''}`}
                            onClick={() => toggleTag(tag)}
                            aria-pressed={selected}
                            disabled={disabled}
                        >
                            {tag}
                        </button>
                    );
                })}
            </div>

            {/* הצגת הנבחרות + אפשרות להסרה */}
            {tags.length > 0 && (
                <div className="cc-selected">
                    {tags.map(tag => (
                        <span key={tag} className="cc-selected-chip" onClick={() => removeTag(tag)} title="הסרת קטגוריה">✕ {tag}</span>
                    ))}
                </div>
            )}
        </>
    )
}

export default Tags