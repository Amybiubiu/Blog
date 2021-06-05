function useState(init){
    const old
}
function Conuter(){
    const [state, setState] = Didact.useState(1);
    return Didact.createElement("h1", {
        onClick: () => setState(c => c+1)
    }, "Count: ", state);
}
