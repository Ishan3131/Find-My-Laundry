function MessageBox(props) {
    return (
        <div className={`relative left-1/2 -translate-x-1/2
            w-fit py-1.5 px-1 rounded-md
            text-center text-xs font-bold
            text-[clamp(10px,3cqi,30px)]
            ${props.style}`}>
            {props.text}
        </div>
    )
}

export default MessageBox