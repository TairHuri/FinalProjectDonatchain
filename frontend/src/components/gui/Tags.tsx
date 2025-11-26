import { useEffect, useState } from "react";

/**
 * Props for the Tags component.
 * @property tags - The currently selected tags.
 * @property tagLoader - Async function that retrieves available tags.
 * @property handleChange - Callback to update selected tags in the parent.
 * @property maxTags - Maximum allowed selected tags (default: 3).
 */
export type TagProps = {
    tags: string[];
    tagLoader: () => Promise<{ [key: string]: string }[]>;
    handleChange: (field: string, value: string | number | string[]) => void;
    maxTags?: number;
}
/**
 * Displays selectable tag chips with a limit of chosen items.
 * Allows choosing up to `maxTags` values and removing selected ones.
 */
const Tags = ({ tags, tagLoader, handleChange, maxTags=3 }: TagProps) => {
    const [allTags, setAllTags] = useState<{ [key: string]: string }[]>([]);
 
 
    /**
     * Fetch available tags once when the component mounts.
     */
    const loadTags = async () => {
        const t = await tagLoader();
        setAllTags(t);
    }
    useEffect(() => {
        loadTags();
    }, []);

      /**
     * Toggles a tag: selects it if not chosen; removes it if already selected.
     * Prevents selecting more tags than `maxTags`.
     * @param tag - The tag to toggle.
     */
    const toggleTag = (tag: string) => {

        const exists = tags.includes(tag);
        if (exists) return handleChange('tags', tags.filter(t => t !== tag))

        if (tags.length >= maxTags) return;               // מגבלה עד 3

        handleChange('tags', [...tags, tag])
    };
        /**
     * Force-removes a selected tag from the chosen list.
     * @param tag - The tag to remove.
     */
    const removeTag = (tag: string) => handleChange('tags', tags.filter(t => t !== tag));
    
    return (
        <>
            <div className="cc-chips">
                {allTags.map(({ tag }) => {
                    const selected = tags.includes(tag);
                    const disabled = !selected && tags.length >= maxTags;
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

            {/* Display selected tags + allow removal */}
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