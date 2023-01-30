function closeButton() {
    document.querySelector('.pcFrame button').addEventListener('click', () => {

        document.querySelector('.pcFrame').style.display = 'none';
        document.querySelector('.single-chain').remove();
    })
}

export default closeButton;