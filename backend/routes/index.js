import notebook from '../controllers/notebookController';

export default (app) => {
    app.route('/notes')
        .put(notebook.createNote);
};