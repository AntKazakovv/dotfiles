<ul class="nav nav-tabs" role="tablist">
    <li class="active">
        <a href="#english" role="tab" id="english-tab" data-toggle="tab" data-link="english">English</a>
    </li>
    <li>
        <a href="#russian" role="tab" id="russian-tab" data-toggle="tab" data-link="russian">Russian</a>
    </li>
</ul>
<div class="tab-content">
<div class="tab-pane fade active in" id="c-english">

# Game thumb Component
For activation "3D" animation necessary choice **type: 'vertical'** and **themeMod: 'transform'**.

## Params
Interface [IGameThumbCParams](/docs/compodoc/interfaces/IGameThumbCParams.html#info)

- **transformThumb** - settings vertical transform thumb
  - **correct** - the values influencing the strength of the transformation. The more the stronger the transformation
    - **host** - configures by `rotateX()` and `rotateY()`
      - **x** - gain along the x coordinate **(default: 1)**
      - **y** - gain along the y coordinate **(default: 2.5)**
    - **layers** - configures `translateX()` and `translateY()`
      - **x** - gain along the x coordinate **(default: 1.5)**
      - **y** - gain along the y coordinate **(default: 2.5)**

```typescript
export const $modules = {
    games: {
        components: {
            'wlc-game-thumb' : {
                transformThumb: {
                    correct: {
                        host: {
                            x: 1,
                            y: 2.5,
                        },
                        layers: {
                            x: 1.5,
                            y: 2.5,
                        },
                    },
                },
            },
        },
    },
}
```

</div>
<div class="tab-pane fade" id="c-russian">

# Game thumb Component
Для активации «3D» анимации необходимо выбрать **type: 'vertical'** и **themeMod: 'transform'**.

## Params
Интерфейс [IGameThumbCParams](/docs/compodoc/interfaces/IGameThumbCParams.html#info)

- **transformThumb** - настройка вертикальных тумбнях
  - **correct** - значения, влияющие на силу трансформации. Чем больше, тем сильнее трансформация.
    - **host** - корректируются `rotateX()` и `rotateY()` у `#transform`
      - **x** - усиление по координате x **(по умолчанию: 1)**
      - **y** - усиление по координате y **(по умолчанию: 2.5)**
    - **layers** - корректируются `translateX()` и `translateY()` у `#layersOne` и `#layersTwo`
      - **x** - усиление по координате x **(по умолчанию: 1.5)**
      - **y** - усиление по координате y **(по умолчанию: 2.5)**

```typescript
export const $modules = {
    games: {
        components: {
            'wlc-game-thumb' : {
                transformThumb: {
                    correct: {
                        host: {
                            x: 1,
                            y: 2.5,
                        },
                        layers: {
                            x: 1.5,
                            y: 2.5,
                        }
                    }
                },
            }
        }
    }
}
```

</div>
</div>

