import { forwardRef } from 'react'
import type { MouseEvent, ElementType, ReactNode } from 'react'

export interface ButtonProps {
  asElement?: ElementType
  children?: ReactNode
  className?: string
  disabled?: boolean
  icon?: ReactNode
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void
  size?: 'xs' | 'sm' | 'md' | 'lg'
  variant?: 'solid' | 'plain' | 'outline'
  iconAlignment?: 'start' | 'end'
  block?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const {
    asElement: Component = 'button',
    children,
    className = '',
    disabled = false,
    icon,
    onClick,
    size = 'md',
    variant = 'outline',
    iconAlignment = 'start',
    block = false,
    ...rest
  } = props

  const getButtonSize = () => {
    const baseClasses = ['inline-flex', 'items-center', 'justify-center']
    switch (size) {
      case 'lg':
        return [
          ...baseClasses,
          'h-12',
          'rounded-3xl',
          icon && !children ? 'w-12 text-2xl' : 'px-6 text-base'
        ]
      case 'sm':
        return [
          ...baseClasses,
          'h-8',
          'rounded-3xl',
          icon && !children ? 'w-8 text-lg' : 'px-2 text-sm'
        ]
      case 'xs':
        return [
          ...baseClasses,
          'h-6',
          'rounded-3xl',
          icon && !children ? 'w-6 text-base' : 'px-3 text-xs'
        ]
      default:
        return [
          ...baseClasses,
          'h-10',
          'rounded-3xl',
          icon && !children ? 'w-10 text-xl' : 'px-5 text-base'
        ]
    }
  }

  const getButtonVariant = () => {
    const baseClasses: string[] = []
    switch (variant) {
      case 'outline':
        return [
          ...baseClasses,
          'bg-primary',
          'text-white','border border-transparent',
          !disabled ? 'hover:border-white' : '',
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        ]
      case 'plain':
        return [
          ...baseClasses,
          'bg-light',
          'text-primary',
          !disabled ? 'hover:bg-grayPlaceholder' : '',
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        ]
      case 'solid':
        return [
          ...baseClasses,
          'bg-white',
          'border',
          'border-primary',
          'text-primary',
          !disabled ? 'hover:bg-light hover:text-primary hover:border-light' : '',
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        ]
    }
  }

  const classes = [
    'font-medium',
    'transition-colors',
    ...getButtonSize(),
    ...getButtonVariant(),
    block ? 'w-full' : '',
    className
  ]
    .filter(Boolean)
    .join(' ')

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (disabled) {
      e.preventDefault()
      return
    }
    onClick?.(e)
  }

  const renderChildren = () => {
    if (icon && !children) {
      return icon
    }
    if (icon && children) {
      return (
        <span className="flex items-center gap-2">
          {iconAlignment === 'start' && icon}
          {children}
          {iconAlignment === 'end' && icon}
        </span>
      )
    }
    return children
  }

  return (
    <Component
      ref={ref}
      className={classes}
      onClick={handleClick}
      disabled={disabled}
      {...rest}
    >
      {renderChildren()}
    </Component>
  )
})

Button.displayName = 'Button'

export default Button