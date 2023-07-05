import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './App.css';

function App() {

  const apiEndPoint = "https://data.education.gouv.fr/api/records/1.0/search/?dataset=fr-esr-parcoursup&q=&rows=10&facet=session&facet=contrat_etab&facet=cod_uai&facet=g_ea_lib_vx&facet=dep_lib&facet=region_etab_aff&facet=acad_mies&facet=ville_etab&facet=lib_for_voe_ins&facet=select_form&facet=fili&facet=form_lib_voe_acc&facet=fil_lib_voe_acc&facet=detail_forma&facet=tri&facet=cod_aff_form&facet=etablissement_id_paysage&facet=composante_id_paysage"

  const [data, setData] = useState({});
  const [query, setQuery] = useState('');
  const [start, setStart] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchData = async (url) => {
    const response = await fetch(url);
    return response.json();
  }

  // Récupère les 10 premiers resultat du jeu de données
  // Cette fonction ne s'éxéccute qu'une seule fois
  useEffect(() => {

    fetchData(apiEndPoint)
      .then(data => {
        // console.log(data);
        setData(data);
        setLoading(false);
      })
      .catch(error => {
        console.log(error)
        setLoading(false);
      });

  }, [])

  // Effectue une recherche à base d'un terme préci lorsque le formulaire de recherche est soumis.
  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    const url = `https://data.education.gouv.fr/api/records/1.0/search/?dataset=fr-esr-parcoursup&q=${query}&rows=10&facet=session&facet=contrat_etab&facet=cod_uai&facet=g_ea_lib_vx&facet=dep_lib&facet=region_etab_aff&facet=acad_mies&facet=ville_etab&facet=lib_for_voe_ins&facet=select_form&facet=fili&facet=form_lib_voe_acc&facet=fil_lib_voe_acc&facet=detail_forma&facet=tri&facet=cod_aff_form&facet=etablissement_id_paysage&facet=composante_id_paysage`
    fetchData(url)
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(error => {
        console.log(error)
        setLoading(false);
      });
  }

  // Page précedente
  const handlePreviousPage = async () => {
    setStart(prevState => prevState - 10)
    console.log(start)
  }

  // Page suivante
  const handleNextPage = async () => {
    setStart(prevState => prevState + 10)
    console.log(start)
  }

  // Effectue la recherche lorsque le paramètre start de l'url change. (pagination)
  // Cette fonction ne s'exécute que lorque le paramètre start est changé.
  useEffect(() => {
    const url = `https://data.education.gouv.fr/api/records/1.0/search/?dataset=fr-esr-parcoursup&q=${query}&start=${start}&rows=10&facet=session&facet=contrat_etab&facet=cod_uai&facet=g_ea_lib_vx&facet=dep_lib&facet=region_etab_aff&facet=acad_mies&facet=ville_etab&facet=lib_for_voe_ins&facet=select_form&facet=fili&facet=form_lib_voe_acc&facet=fil_lib_voe_acc&facet=detail_forma&facet=tri&facet=cod_aff_form&facet=etablissement_id_paysage&facet=composante_id_paysage`

    if (start >= 0) {
      setLoading(true);
      fetchData(url)
        .then(data => {
          setData(data);
          setLoading(false);
        })
        .catch(error => {
          console.log(error)
          setLoading(false);
        });
    }
  }, [start])

  // Si l'application est en train de charger les données
  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  // Si aucun donnée n'est disponible
  if (!data) {
    return (
      <>No data available</>
    )
  }

  return (
    <div className="container-fluid p-5">

      <div className="mb-5">
        <h1 className="text-center">Voeux parcoursup</h1>
        <p>Cette application affiche les informations relatives aux établissements et aux voeux d'étudiants.</p>
        <p>Les informations de cette application proviennent de l'API parcoursup: <span className="text-warning text-break">https://data.education.gouv.fr/api/records/1.0/search/?dataset=fr-esr-parcoursup&q=${query}&start=${start}&rows=10&facet=session&facet=contrat_etab&facet=cod_uai&facet=g_ea_lib_vx&facet=dep_lib&facet=region_etab_aff&facet=acad_mies&facet=ville_etab&facet=lib_for_voe_ins&facet=select_form&facet=fili&facet=form_lib_voe_acc&facet=fil_lib_voe_acc&facet=detail_forma&facet=tri&facet=cod_aff_form&facet=etablissement_id_paysage&facet=composante_id_paysage</span></p>
      </div>

      {/* Formulaire de recherche */}
      <form onSubmit={handleSearch}>
        <div className="input-group mb-4">
          <input
            type="search"
            value={query}
            className="form-control"
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un établissement" />
          <button type="submit" className="btn btn-success">Rechercher</button>
        </div>
      </form>

      {/* Tableau de données */}
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th title="Statut de l'établissement et de la filière de formation">Status établissement et filière</th>
              <th>Code UA de l'établiss</th>
              <th>Établissement</th>
              <th>Code département étab</th>
              <th>Département étab</th>
              <th>Région Etab</th>
              <th>Académie de l'étab</th>
              <th>Commune étab</th>
              <th>Filère formation</th>
              <th>Séléctivité</th>
              <th>Regroupement 1 effectué par les formations pour les classements</th>
              <th>Filière formation très agregée</th>
              <th>Filière formation détaillée</th>
              <th>Filière formation</th>
              <th>Filière de formation détaillée bis</th>
              <th>Capacité de l’établissement par formation</th>
              <th>Effectif total des candidats pour une formation</th>
              <th>Lien de la formation sur la plateforme Parcoursup</th>
            </tr>
          </thead>
          <tbody>
            {data.records.length > 0 &&
              data.records.map((record, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{record.fields.contrat_etab}</td>
                  <td>{record.fields.cod_uai}</td>
                  <td>{record.fields.g_ea_lib_vx}</td>
                  <td>{record.fields.dep}</td>
                  <td>{record.fields.dep_lib}</td>
                  <td>{record.fields.region_etab_aff}</td>
                  <td>{record.fields.acad_mies}</td>
                  <td>{record.fields.ville_etab}</td>
                  <td>{record.fields.lib_for_voe_ins}</td>
                  <td>{record.fields.select_form}</td>
                  <td>{record.fields.lib_grp1}</td>
                  <td>{record.fields.fili}</td>
                  <td>{record.fields.lib_comp_voe_ins}</td>
                  <td>{record.fields.form_lib_voe_acc}</td>
                  <td>{record.fields.fil_lib_voe_acc}</td>
                  <td>{record.fields.capa_fin}</td>
                  <td>{record.fields.voe_tot}</td>
                  <td><Link to={record.fields.lien_form_psup} target="_blanck">{record.fields.lien_form_psup}</Link></td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Bouttons de controles */}
      <div className="d-flex justify-content-end gap-2 mt-4">
        {start > 0 && <button className="btn btn-secondary" onClick={handlePreviousPage}>Précédent</button>}
        <button className="btn btn-secondary" onClick={handleNextPage}>Suivant</button>
      </div>

      <p className="lead">L'API ne propose pas de point d'entrée de soumission de voeux.</p>

    </div>
  );
}

export default App;
