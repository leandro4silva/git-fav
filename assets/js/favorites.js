export class GithubFavorites{
    static search(username){
        const search = `https://api.github.com/users/${username}`

        return fetch(search).then((user) => user.json()).then(({login, name, public_repos, followers}) => ({
            login,
            name, 
            public_repos,
            followers
        }))
    }
}

export class Favorites {
    constructor(root) {
        this.root = document.querySelector(root)
        this.load()
    }

    load() {
        this.entries = []
    }

    async add(username){
        const user = await GithubFavorites.search(username)

        this.entries = [user, ...this.entries]

        this.update()
    }

    delete(user){
        const filterEntries = this.entries.filter((entry) => entry.login === user.login? false : true)

        this.entries = filterEntries

        this.update()
    }
}


export class FavoritesView extends Favorites {
    constructor(root) {
        super(root)
        this.tbody = document.querySelector('table tbody')
        
        this.update()
        this.onadd()
    }

    update() {
        this.removeAllTr()
        const isEmpty = this.entries.length == 0

        if(isEmpty){
            const menssageTr = this.emptyDataTr()

            this.tbody.append(menssageTr)
        }

        this.entries.forEach((user) => {
            const tr = this.createTr()
            tr.querySelector('.user img').src = `https://github.com/${user.login}.png`
            tr.querySelector('.user p').textContent = user.name
            tr.querySelector('.user span').textContent = user.login
            tr.querySelector('.repositores').textContent = user.public_repos
            tr.querySelector('.followers').textContent = user.followers

            tr.querySelector('.remove').onclick = () => {
                const isOk = confirm('Tem certeza que deseja deletar?')

                if(isOk){
                    this.delete(user)
                }
                return
            }
            this.tbody.append(tr)
        })

    }

    onadd(){
        const addButton = document.querySelector('.search button')

        addButton.onclick = () =>{
            
            const { value } = this.root.querySelector('.search input')

            this.add(value)
        }
    }

    createTr() {

        const tr = document.createElement('tr')

        tr.innerHTML = `
        <td class="user">
            <img src="https://github.com/leandro4silva.png" alt="Imagem de Leandro">
            <a href="https://github.com/leandro4silva" target="_blank">
                <p>Leandro A. Silva</p>
                <span>leandro4silva</span>
            </a>
        </td>
        <td class="repositores">123</td>
        <td class="followers">1234</td>
        <td class="remove">
            <button class="btn-remove"> &times; </button>
        </td>
        `
        return tr
    }


    emptyDataTr(){
         const tr = document.createElement('tr')

         tr.innerHTML = `
            <td colspan="4" class="empty-table">
                <div class="content">
                    <img src="./assets/icon/star.svg" alt="Estrela sorrindo">
                     <h2>Nenhum favorito ainda</h2>
                 </div>
            </td>
         `

         return tr 
    }


    removeAllTr() {
        this.tbody.querySelectorAll('tr').forEach(tr => {
            tr.remove()
        });
    }

}