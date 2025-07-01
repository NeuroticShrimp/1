'use client'

import { useTheme } from '@/components/theme-provider'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Moon, Sun, Palette } from 'lucide-react'

export function ThemeSwitcher() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>
          <Sun className="mr-2 h-4 w-4" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          <Moon className="mr-2 h-4 w-4" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('yellow')}>
          <Palette className="mr-2 h-4 w-4 text-yellow-500" />
          <span>Yellow</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('diamond-pearl')}>
          <Palette className="mr-2 h-4 w-4 text-cyan-700" />
          <span>Diamond & Pearl</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('black-white')}>
          <Palette className="mr-2 h-4 w-4 text-neutral-800" />
          <span>Black & White</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('x-y')}>
          <Palette className="mr-2 h-4 w-4 text-indigo-500" />
          <span>X & Y</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('sun-moon')}>
          <Palette className="mr-2 h-4 w-4 text-orange-500" />
          <span>Sun & Moon</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('sword-shield')}>
          <Palette className="mr-2 h-4 w-4 text-blue-700" />
          <span>Sword & Shield</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('legends-arceus')}>
          <Palette className="mr-2 h-4 w-4 text-gray-700" />
          <span>Legends Arceus</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('scarlet-violet')}>
          <Palette className="mr-2 h-4 w-4 text-red-600" />
          <span>Scarlet & Violet</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          <Palette className="mr-2 h-4 w-4" />
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
