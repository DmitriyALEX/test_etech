export interface IButton {
    title?: string
    alt?: string | undefined
    img?: string
    onClick: () => void
    type?: React.ButtonHTMLAttributes<HTMLButtonElement>['type']
}
