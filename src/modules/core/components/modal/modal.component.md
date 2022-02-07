# Modal component

Determine the reason for closing the modal

`modalComponent.modalDirect.dismissReason` - reasons for closing from ngx component (`backdrop-click`, `esc`)

`closed.then((reason) => {}` - `reason` - reason established by our component (`closeIcon`, `confirm`, `goBack`)

example
```ts
this.modalService.showModal(action).then((modalComponent) => {
    comp.closed.then((reason) => {
        if(modalComponent.modalDirect.dismissReason) {
            ...
        } else if (reason) {
            ...
        }
    });
});
```
