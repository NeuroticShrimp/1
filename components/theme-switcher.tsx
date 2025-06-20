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
        <DropdownMenuItem onClick={() => setTheme('red')}>
          <Palette className="mr-2 h-4 w-4 text-red-600" />
          <span>Red</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('blue')}>
          <Palette className="mr-2 h-4 w-4 text-red-600" />
          <span>Blue</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('yellow')}>
          <Palette className="mr-2 h-4 w-4 text-yellow-500" />
          <span>Yellow</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('gold-silver')}>
          <Palette className="mr-2 h-4 w-4 text-amber-600" />
          <span>Gold & Silver</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('crystal')}>
          <Palette className="mr-2 h-4 w-4 text-cyan-500" />
          <span>Crystal</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('ruby-sapphire')}>
          <Palette className="mr-2 h-4 w-4 text-rose-600" />
          <span>Ruby & Sapphire</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('emerald')}>
          <Palette className="mr-2 h-4 w-4 text-emerald-600" />
          <span>Emerald</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('firered-leafgreen')}>
          <Palette className="mr-2 h-4 w-4 text-red-700" />
          <span>FireRed / LeafGreen</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('diamond-pearl')}>
          <Palette className="mr-2 h-4 w-4 text-cyan-700" />
          <span>Diamond & Pearl</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('platinum')}>
          <Palette className="mr-2 h-4 w-4 text-slate-500" />
          <span>Platinum</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('heartgold-soulsilver')}>
          <Palette className="mr-2 h-4 w-4 text-amber-500" />
          <span>HeartGold / SoulSilver</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('black-white')}>
          <Palette className="mr-2 h-4 w-4 text-neutral-800" />
          <span>Black & White</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('black-2-white-2')}>
          <Palette className="mr-2 h-4 w-4 text-neutral-700" />
          <span>Black 2 & White 2</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('x-y')}>
          <Palette className="mr-2 h-4 w-4 text-indigo-500" />
          <span>X & Y</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('omega-ruby-alpha-sapphire')}>
          <Palette className="mr-2 h-4 w-4 text-rose-700" />
          <span>Ω Ruby / α Sapphire</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('sun-moon')}>
          <Palette className="mr-2 h-4 w-4 text-orange-500" />
          <span>Sun & Moon</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('ultra-sun-ultra-moon')}>
          <Palette className="mr-2 h-4 w-4 text-orange-600" />
          <span>Ultra Sun & Ultra Moon</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('sword-shield')}>
          <Palette className="mr-2 h-4 w-4 text-blue-700" />
          <span>Sword & Shield</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme('brilliant-diamond-shining-pearl')}
        >
          <Palette className="mr-2 h-4 w-4 text-indigo-600" />
          <span>BD & SP</span>
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
