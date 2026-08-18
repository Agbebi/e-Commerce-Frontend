import React, { useState, useEffect, useRef } from 'react'
import { InputBase, Paper, IconButton, alpha, useTheme, Collapse } from '@mui/material'
import { IoSearch, IoClose } from 'react-icons/io5'

function SearchBar({ value, onChange, placeholder, onSearch, fullWidth = false, expanded: controlledExpanded, onExpandChange, expandable = true }) {
  const theme = useTheme()
  const [internalExpanded, setInternalExpanded] = useState(false)
  const isExpanded = controlledExpanded !== undefined ? controlledExpanded : internalExpanded
  const inputRef = React.useRef(null)

  useEffect(() => {
    if (isExpanded) {
      const timeoutId = setTimeout(() => {
        inputRef.current?.focus()
      }, 150)
      return () => clearTimeout(timeoutId)
    }
  }, [isExpanded])

  const handleExpand = () => {
    if (!expandable) return
    if (!isExpanded) {
      setInternalExpanded(true)
      onExpandChange?.(true)
    } else {
      setInternalExpanded(false)
      onExpandChange?.(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      if (expandable) handleExpand()
    } else if (e.key === 'Enter' && onSearch) {
      onSearch(value)
    }
  }

  const handleBlur = () => {
    if (expandable && (!value || value.trim() === '')) {
      handleExpand()
    }
  }

  const showInput = expandable ? isExpanded : true

  return (
    <Paper
      component="form"
      onSubmit={(e) => {
        e.preventDefault()
        if (onSearch) onSearch(value)
      }}
      sx={{
        p: '1px 2px',
        display: 'flex',
        flexDirection: 'row-reverse',
        alignItems: 'center',
        width: fullWidth ? '100%' : 'auto',
        maxWidth: fullWidth ? '100%' : showInput ? 260 : 40,
        borderRadius: 4,
        border: expandable ? (showInput ? '1px solid' : 'none') : '1px solid',
        borderColor: expandable ? (showInput ? 'primary.main' : 'transparent') : 'divider',
        backgroundColor: 'background.paper',
        boxShadow: expandable ? (showInput ? `0 0 0 2px ${alpha(theme.palette.primary.main, 0.12)}` : 'none') : 'none',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          borderColor: expandable ? (showInput ? 'primary.main' : 'transparent') : 'primary.main',
          boxShadow: expandable ? (showInput ? `0 0 0 2px ${alpha(theme.palette.primary.main, 0.12)}` : 'none') : `0 0 0 2px ${alpha(theme.palette.primary.main, 0.08)}`,
        },
        '&.Mui-focused': {
          borderColor: 'primary.main',
          boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
        },
      }}
    >
      <IconButton
        onClick={expandable ? handleExpand : undefined}
        type={expandable ? undefined : 'submit'}
        sx={{
          p: '4px',
          color: 'text.secondary',
          '&:hover': {
            color: 'primary.main',
            backgroundColor: alpha(theme.palette.primary.main, 0.08),
          },
        }}
        aria-label={isExpanded ? 'close search' : 'search'}
      >
        {isExpanded ? <IoClose size={18} /> : <IoSearch size={18} />}
      </IconButton>
      {expandable ? (
        <Collapse in={showInput} orientation="horizontal" sx={{ flex: 1, minWidth: 0 }}>
          <InputBase
            ref={inputRef}
            value={value}
            onChange={onChange}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            placeholder={placeholder || 'Search...'}
            sx={{
              fontSize: '0.8rem',
              '& .MuiInputBase-input': {
                py: '6px',
                px: '8px',
                '::placeholder': {
                  color: 'text.disabled',
                  opacity: 1,
                },
              },
              '& .MuiInputBase-input:focus': {
                outline: 'none',
              },
            }}
            inputProps={{ 'aria-label': 'search' }}
          />
        </Collapse>
      ) : (
        <InputBase
          ref={inputRef}
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || 'Search...'}
          sx={{
            flex: 1,
            fontSize: '0.8rem',
            '& .MuiInputBase-input': {
              py: '6px',
              px: '8px',
              '::placeholder': {
                color: 'text.disabled',
                opacity: 1,
              },
            },
            '& .MuiInputBase-input:focus': {
              outline: 'none',
            },
          }}
          inputProps={{ 'aria-label': 'search' }}
        />
      )}
    </Paper>
  )
}

export default SearchBar
