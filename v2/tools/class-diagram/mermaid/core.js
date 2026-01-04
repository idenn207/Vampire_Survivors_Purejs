export const core = {
  title: 'Core Namespace',
  description: 'VampireSurvivors.Core - Game loop, events, input handling, and camera',
  content: `
classDiagram
    class Game {
        -_canvas
        -_ctx
        -_time
        -_input
        -_camera
        -_systems
        -_state
        +initialize(canvasId)
        +start()
        +pause()
        +resume()
        +addSystem(system)
        +removeSystem(system)
        +setResolution(w, h)
    }

    class EventBus {
        -_listeners
        +on(event, callback)
        +once(event, callback)
        +off(event, callback)
        +emit(event, data)
        +emitSync(event, data)
    }

    class Time {
        +deltaTime
        +unscaledDeltaTime
        +timeScale
        +elapsed
        +frameCount
        +fps
        +update()
        +pause()
        +resume()
    }

    class Input {
        -_keys
        -_mouse
        +isKeyDown(key)
        +isKeyPressed(key)
        +getMousePosition()
        +update()
    }

    class Camera {
        +x
        +y
        +width
        +height
        +zoom
        +target
        +follow(entity)
        +update()
        +worldToScreen(x, y)
        +screenToWorld(x, y)
    }

    class AssetLoader {
        -_images
        -_spriteSheets
        +loadImage(id, path)
        +getImage(id)
        +loadSpriteSheet(id, path, config)
    }

    class UIScale {
        +scale
        +baseWidth
        +baseHeight
        +calculate(canvas)
        +apply(ctx)
    }

    class i18n {
        -_locale
        -_translations
        +setLocale(locale)
        +t(key)
        +loadTranslations(locale)
    }

    Game --> Time
    Game --> Input
    Game --> Camera
    Game --> EventBus
    Game --> AssetLoader
    Game --> UIScale
`,
};

