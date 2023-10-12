const toCurrency = (price) => {
    return new Intl.NumberFormat('ru-RU', {
        currency: 'rub',
        style: 'currency'
    }).format((price))
}

const toDate = (date) => {
    return new Intl.DateTimeFormat('ru-RU', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',

    }).format(new Date(date))
}

document.querySelectorAll('.price').forEach(node => {
    node.textContent = toCurrency(node.textContent)
})

document.querySelectorAll('.date').forEach(node =>{
    node.textContent = toDate(node.textContent)
})

const $basket = document.querySelector('#basket')
if ($basket) {
    $basket.addEventListener('click', event => {
        if (event.target.classList.contains('js-remove')) {
            const id = event.target.dataset.id


            fetch("/basket/remove/" + id, {
                method: 'delete'
            }).then(res => res.json())
                .then(basket => {
                    if (basket.courses.length) {
                        const html = basket.courses.map(c => {
                            return `
                            <tr>
                                <td>${c.title}</td>
                                <td>${c.count}</td>
                                <td>
                                    <button class="btn btn-small js-remove" data-id=${c.id}>Delete</button>
                                </td>
                            </tr>
                            `
                        }).join('')
                        $basket.querySelector('tbody').innerHTML = html
                        $basket.querySelector('.price').textContent = toCurrency(basket.price)
                    } else {
                        $basket.innerHTML = '<p>Basket is empty !!!</p>'
                    }
                })
        }
    })
}

M.Tabs.init(document.querySelectorAll('.tabs'));




