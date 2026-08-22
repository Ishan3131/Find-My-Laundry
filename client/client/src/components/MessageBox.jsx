function MessageBox(props) {
    return (
        <div className={`relative left-1/2 -translate-x-1/2
            w-fit py-1.5 px-1 rounded-md shadow-md
            text-center text-xs font-medium
            text-[3cqi]
            bg-gray-500 ${props.style}`}>
            {props.text}
        </div>
    )
}

export default MessageBox