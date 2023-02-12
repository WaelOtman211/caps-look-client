import ContentsTable from '../../components/ContentsTable'
import PageContainer from '../../components/PageContainer'
import ListItem from './detailsComponent'
import style from './style.module.scss'

const Home = () => {
  return (
    <PageContainer name = "Home">
      <div>
        <ListItem />
      </div>
    </PageContainer>
  )
}

export default Home
