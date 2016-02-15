# Combine Redux & Elmish style
- Elmish Elm inspired library: https://github.com/ccorcos/elmish

It tries to steal the flyd flow and effects from _Elmish_.

## Basic Principles
- slice state to children component
- forward actions for chidlren through the component reducer (update function)
- effects: each component can define effects which are specific to the component (http requests, shortcuts,...)

## Extended Principles
- global aciton is hanled by middleware which resend children action as the root one
- path can be gathered with extra middleware as well
- workflow middleware - super simple attempt to replace redux-saga until typescript support generator syntax correctly

## Used libraries
- Flyd - reactive library (similar to RxJs)






  