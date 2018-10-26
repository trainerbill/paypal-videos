function route(name) {
    hideAll();
    switch (name) {
        case 'cart':
            document.getElementById('cart').style.display = "initial";
            break;
        case 'payment':
            document.getElementById('payment').style.display = "initial";
            break;
        case 'confirmation':
            document.getElementById('confirmation').style.display = "initial";
            break;
        case 'done':
            document.getElementById('done').style.display = "initial";
            break;
        default:
            throw new Error('Route not setup');
    }
}

function hideAll() {
    $('#cart').hide();
    $('#shipping').hide();
    $('#payment').hide();
    $('#review').hide();
    $('#complete').hide();
}
