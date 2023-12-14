import Group from '../models/groupModel.js';
const getGroups = async(req, res) => {
    const groups = await Group.find();
    res.render('admin/groups/index', {groups})
}

const createGroup_view = async(req, res) => {
    res.render('admin/groups/create');
}

const createGroup = async(req, res) => {
    const { title } = req.body;
    const group = await Group.create({
        title: title,
        user: req.user
    });
    if(group) {
        res.redirect('/admin/groups');
    }
}
export {
    getGroups,
    createGroup_view,
    createGroup,
}