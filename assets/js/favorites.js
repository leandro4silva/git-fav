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
        this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
    }

    async add(username){
        try{
            const userExist = this.entries.find((user) => username == user.login)
            
            if(userExist){
                throw new Error('Esse usuario já foi favoritado')
            }

            const user = await GithubFavorites.search(username)

            if(user.login == undefined){
                throw new Error('Usuario não encontrado')
            }
    
            this.entries = [user, ...this.entries]
    
            this.update()
            this.save()

        }catch(error){
            alert(error.message)
        }
    }

    save(){
        localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
    }

    delete(user){
        const filterEntries = this.entries.filter((entry) => entry.login === user.login? false : true)

        this.entries = filterEntries

        this.update()
        this.save()
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
            tr.querySelector('.user img').alt = `Imagem de ${user.name}`
            tr.querySelector('.user a').href = `https://github.com/${user.login}`
            tr.querySelector('.user p').textContent = user.name
            tr.querySelector('.user span').textContent = `/${user.login}`
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
        const searchInput = this.root.querySelector('.search input')
        
        addButton.onclick = () =>{
            const { value } = searchInput
            this.add(value)
            searchInput.value = ''
        }

        searchInput.onkeypress = (e) => {
            const { value } = searchInput
            
            if(e.key == 'Enter') {
                this.add(value)
                searchInput.value = ''
            } 
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
            <button class="btn-remove"> <span>&times;</span> Remover </button>
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