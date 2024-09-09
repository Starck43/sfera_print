type Dict = Record<string, boolean | string | undefined>
type Arr = Array<string | undefined>

interface IClassNames {
    [className: string]: string
}

export function classnames(
    cls: IClassNames | null,
    classes: Arr = [],
    dict: Dict = {},
    additional: Arr = []
): string {
    if (!cls) return [...additional.filter(Boolean)].join(' ')
    return [
        ...classes
            .filter(Boolean)
            .map((classname) => (classname ? cls[classname] : null)),
        ...Object.entries(dict)
            .filter(([_, value]) => Boolean(value))
            .map(([classname, _]) => (classname ? cls[classname] : classname)),
        ...additional.filter(Boolean)
    ].join(' ')
}
