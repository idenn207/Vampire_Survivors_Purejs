export const core = {
  title: 'Core Namespace',
  description: 'VampireSurvivors.Core - Game loop, events, input handling, and camera',
  content: `
classDiagram
    class Game {
        -Canvas _canvas
        -Context _ctx
        -Time _time
        -Input _input
        -Camera _camera
        -Array _systems
        -GameState _state
        +initialize(canvasId)
        +start()
        +pause()
        +resume()
        +addSystem(system)
        +removeSystem(system)
        +setResolution(w, h)
    }

    class EventBus {
        -Map _listeners
        +on(event, callback)
        +once(event, callback)
        +off(event, callback)
        +emit(event, data)
        +emitSync(event, data)
    }

    class Time {
        +number deltaTime
        +number unscaledDeltaTime
        +number timeScale
        +number elapsed
        +number frameCount
        +number fps
        +update()
        +pause()
        +resume()
    }

    class Input {
        -Map _keys
        -Object _mouse
        +isKeyDown(key)
        +isKeyPressed(key)
        +getMousePosition()
        +update()
    }

    class Camera {
        +number x
        +number y
        +number width
        +number height
        +number zoom
        +Entity target
        +follow(entity)
        +update()
        +worldToScreen(x, y)
        +screenToWorld(x, y)
    }

    class AssetLoader {
        -Map _images
        -Map _spriteSheets
        +loadImage(id, path)
        +getImage(id)
        +loadSpriteSheet(id, path, config)
    }

    class UIScale {
        +number scale
        +number baseWidth
        +number baseHeight
        +calculate(canvas)
        +apply(ctx)
    }

    class i18n {
        -string _locale
        -Object _translations
        +setLocale(locale)
        +t(key)
        +loadTranslations(locale)
    }

    Game --> Time : uses
    Game --> Input : uses
    Game --> Camera : uses
    Game --> EventBus : emits events
    Game --> AssetLoader : loads assets
    Game --> UIScale : scales UI
    `,
};

