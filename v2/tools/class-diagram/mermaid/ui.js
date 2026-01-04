export const ui = {
  title: 'UI Classes',
  description: 'VampireSurvivors.UI - HUD, screens, panels, and overlays (28 classes)',
  content: `
classDiagram
    direction TB

    class HUD {
        -StatusPanel _statusPanel
        -WeaponSlots _weaponSlots
        -DamageNumbers _damageNumbers
        -WaveAnnouncement _waveAnnouncement
        -BossHealthBar _bossHealthBar
        -Minimap _minimap
        +setPlayer(player)
        +update(deltaTime)
        +render(ctx)
    }

    class StatusPanel {
        +renderHealth(ctx)
        +renderExperience(ctx)
        +renderGold(ctx)
        +renderShield(ctx)
    }

    class WeaponSlots {
        +renderSlots(ctx)
        +renderCooldowns(ctx)
    }

    class DamageNumbers {
        -Array _numbers
        +spawn(x, y, damage, isCrit)
        +update(deltaTime)
        +render(ctx)
    }

    class WaveAnnouncement {
        +show(waveNumber)
        +hide()
        +render(ctx)
    }

    class BossHealthBar {
        +setBoss(boss)
        +render(ctx)
    }

    class EntityHealthBars {
        +render(ctx, entities)
    }

    class SkillCooldowns {
        +render(ctx, skill)
    }

    class Minimap {
        +render(ctx, entities)
    }

    class PlayerStatusEffects {
        +render(ctx, effects)
    }

    class PlayerOverhead {
        +render(ctx, player)
    }

    class ShieldBar {
        +render(ctx, shield)
    }

    class LevelUpScreen {
        -Array _options
        -number _selectedIndex
        +show(options)
        +hide()
        +selectOption(index)
        +render(ctx)
    }

    class CoreSelectionScreen {
        -Array _cores
        -number _selectedIndex
        +show()
        +selectCore(index)
        +render(ctx)
    }

    class CharacterSelectionScreen {
        -Array _characters
        +show()
        +selectCharacter(id)
        +render(ctx)
    }

    class GameOverScreen {
        -Object _stats
        +show(stats)
        +render(ctx)
    }

    class PauseMenuScreen {
        +show()
        +hide()
        +render(ctx)
    }

    class TabScreen {
        -string _activeTab
        +show()
        +switchTab(tabId)
        +render(ctx)
    }

    class TechUnlockPopup {
        -Array _choices
        +show(choices)
        +selectChoice(index)
        +render(ctx)
    }

    class TechTreePanel {
        +render(ctx, techTree)
    }

    class TechUpgradePanel {
        +render(ctx, tech)
    }

    class StatUpgradePanel {
        +render(ctx, stats)
    }

    class EvolutionPopup {
        +show(evolution)
        +render(ctx)
    }

    class EvolutionListPanel {
        +render(ctx, evolutions)
    }

    class WeaponCardPanel {
        +render(ctx, weapon)
    }

    class WeaponGridPanel {
        +render(ctx, weapons)
    }

    class UpgradeTooltip {
        +show(upgrade)
        +hide()
        +render(ctx)
    }

    class ScrollBar {
        +render(ctx)
        +handleScroll(delta)
    }

    HUD *-- StatusPanel
    HUD *-- WeaponSlots
    HUD *-- DamageNumbers
    HUD *-- WaveAnnouncement
    HUD *-- BossHealthBar
    HUD *-- Minimap
    HUD *-- EntityHealthBars
    HUD *-- SkillCooldowns
    HUD *-- PlayerStatusEffects
    HUD *-- PlayerOverhead
    HUD *-- ShieldBar
    `
};
