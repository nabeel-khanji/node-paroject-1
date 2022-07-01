/**
 * User.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

const BaseController = require("../controllers/BaseController");

var columns = [
  { data: "name", title: "Name", searchable: true },
  { data: "emailAddress", title: "Email" },
  { data: "actions", title: "Actions" },
];
const route = "user";

module.exports = {
  attributes: {},

  setUpdateData: async (req,params)=>{
    return {
        mobile_json: req.body.mobile_json,
        name: params.name,
        guest_user: false,
        is_verified: true,
        soundEffects: 1,
        notifications: 1,
        soloTimer: 1,
        totalScorePutt: 0,
        totalScoreChip: 0,
        nameToLowerCase: params.name.toLowerCase(),
        socketRoomObj: {
          // createdBy: "req.body.createdBy",
          // createdDate: "req.body.createdDate",
          // lastUpdatedAt: "req.body.lastUpdatedAt",
          // _id: "req.body._id",
          // roomId: "req.body.roomId",
          // state: "req.body.state",
        },
        country: params.country,
        emailAddress: params.emailAddress,
        state: "Sindh",
        rocketChatObj: {
          // userId: "req.body.userId",
          // authToken: "req.body.authToken",
          // user_name: "req.body.user_name",
        },
        rocketChatRoomObj: {
          // roomId: "req.body.roomId",
          // roomName: "req.body.roomName",
        },
    }
  },
  socialLogin: async (inputs) => {
    let user = await User.findOne({ platformId: inputs.platformId });

    if (inputs.user_id && user) {
      throw "User already signed up with this account";
    }

    if (!user) {
      inputs.socialLogin = true;

      inputs.is_verified = true;

      if (inputs.user_id) {
        user = await User.findOne({ id: inputs.user_id });

        if (!user) {
          throw "Invalid User Id";
        }

        inputs.guest_user = false;

        await User.updateOne({ id: inputs.user_id }).set(inputs);

        user = await User.profile(user.id);
      } else {
        user = await User.create(inputs).fetch();
      }
    }

    user.access_token = await Tokens.createTokenForUser(user.id);

    user.rocketChatObj = await User.loginRocketChat(user.id);

    return user;
  },

  guestLogin: async (inputs) => {
    let last_guest_user = await User.count({ guest_user: true });

    if (!inputs.name) {
      inputs.name = "Guest" + (last_guest_user + 1);
    }

    inputs.guest_user = true;

    let user = await User.create(inputs).fetch();

    user.access_token = await Tokens.createTokenForUser(user.id);

    return user;
  },

  profile: async (userID) => {
    let userProfile = await User.findOne({
      id: userID,
    });

    if (!userProfile) {
      return null;
    }

    if (userProfile.access_token) {
      delete userProfile.access_token;
    }

    return userProfile;
  },

  beforeCreate: async (data, proceed) => {
    if (data.emailAddress) {
      if (await User.count({ emailAddress: data.emailAddress })) {
        proceed(customServices.modelError("Email already exists.", 400));
        return;
      }
    }

    data.soundEffects = 1;
    data.notifications = 1;
    data.soloTimer = 1;
    data.nameToLowerCase = data.name ? data.name.toLowerCase() : "";

    proceed();
  },

  beforeUpdate: async (data, proceed) => {
    if (data.name) {
      data.nameToLowerCase = data.name;
    }

    proceed();
  },

  afterCreate: async (data, proceed) => {
    data.rocketChatObj = await User.createUserOnRocketChat(data);

    data.rocketChatRoomObj = await User.createRocketChatRoomWithAdmin(data);

    await User.updateOne({ id: data.id }).set({ user_id: data.id });

    proceed();
  },

  afterUpdate: async (data, proceed) => {
    if (!data.rocketChatObj) {
      data.rocketChatObj = await User.createUserOnRocketChat(data);
    } else {
      let rocketChatData = {
        userId: data.rocketChatObj.userId,
        data: {
          name: data.name ? data.name : data.id,
          customFields: {
            avatar: data.avatar ? data.avatar : "",
            appId: data.id,
          },
        },
      };

      rocketChat.updateUser(
        {
          authToken: data.rocketChatObj.authToken,
          userId: data.rocketChatObj.userId,
        },
        rocketChatData
      );
    }

    if (!data.rocketChatRoomObj) {
      data.rocketChatRoomObj = await User.createRocketChatRoomWithAdmin(data);
    }

    proceed();
  },

  createUserOnRocketChat: async (data) => {
    let rocketChatData = {
      name: data.name ? data.name : data.id,
      email: data.id + "@4par.com",
      username: data.id,
      verified: true,
      customFields: {
        avatar: data.avatar ? data.avatar : "",
        appId: data.id,
      },
    };

    let rocketChatResp = await rocketChat.createUser(rocketChatData);

    rocketChatResp = JSON.parse(rocketChatResp.body);

    if (rocketChatResp.status == "success") {
      let rocketChatObj = {
        userId: rocketChatResp.data.userId,
        authToken: rocketChatResp.data.authToken,
        user_name: rocketChatResp.data.me.username,
      };

      await User.update({ id: data.id }).set({
        rocketChatObj: rocketChatObj,
      });

      return rocketChatObj;
    }
  },

  loginRocketChat: async (user_id) => {
    let rocketChatResp = await rocketChat.login({ id: user_id });

    rocketChatResp = JSON.parse(rocketChatResp.body);

    if (rocketChatResp.status == "success") {
      let rocketChatObj = {
        userId: rocketChatResp.data.userId,
        authToken: rocketChatResp.data.authToken,
        user_name: rocketChatResp.data.me.username,
      };

      await User.update({ id: user_id }).set({
        rocketChatObj: rocketChatObj,
      });

      return rocketChatObj;
    }
  },

  createRocketChatRoomWithAdmin: async (user) => {
    let params = {
      name: `room-admin-${user.id}-${new Date().getTime()}`,
    };

    let rocketChatResp = await rocketChat.createRoom(
      {
        authToken: user.rocketChatObj.authToken,
        userId: user.rocketChatObj.userId,
      },
      params
    );

    rocketChatResp = JSON.parse(rocketChatResp.body);

    if (rocketChatResp.success) {
      let rocketChatObj = {
        roomId: rocketChatResp.group._id,
        roomName: rocketChatResp.group.name,
      };

      await User.update({ id: user.id }).set({
        rocketChatRoomObj: rocketChatObj,
      });

      BusinessUser.addAdminToMemberChat(rocketChatObj.roomId, user);

      return rocketChatObj;
    }
  },

  getRandomUsers: async (user_id) => {
    let userCount = await User.count({ id: { "!=": user_id } });

    let skip = parseInt(Math.random() * userCount);

    let users = await User.find({ id: { "!=": user_id } })
      .limit(10)
      .skip(skip);

    return users.sort(() => 0.5 - Math.random());
  },

  findAll: async (params) => {
    let match = {
      where: { is_verified: true },
    };

    if (params.searchValue) {
      match.where.or = User.columnsToSearch(params.searchValue);
    }

    let total = await User.count(match);

    let users = await User.find(match).limit(params.limit).skip(params.offset);

    return Promise.all(users).then((data) => {
      return {
        data: data,
        pagination: customServices.pagination_detail(
          total,
          params.page,
          params.limit
        ),
      };
    });
  },

  columnsToSearch: (searchValue) => {
    return [
      { name: { contains: searchValue } },
      { nameToLowerCase: { contains: searchValue } },
      { _id: searchValue },
    ];
  },

  getDatatableColumns: async function (req, res) {
    return [
      { data: "name", title: "Name", searchable: true },
      { data: "emailAddress", title: "Email" },
      { data: "actions", title: "Actions" },
    ];
  },

  getData: async function (req, res) {
    try {
      var params = req.allParams();

      let query = {
        where: {},
      };

      var params = req.allParams();
      var value = params.search.value;

      if (value != "") {
        //await added
        query = { where: { or: await User.dataTableColumns(value) } };
        // query.where.or = await Role.dataTableColumns(value)
      }
      let totalRecords = await User.count(query);
      let totalRecordwithFilter = await User.count(query);
      query.limit = params.length;
      query.skip = params.start;
      users = await User.find(query);

      // query = { where: { user_type: "consumer" } };

      let promises = _.map(users, async (user) => {
        let action = await BaseController.getActions(req, route, user);

        let columnsData = {};
        columns.forEach((element) => {
          columnsData[element.data] = customServices.checkStringValue(
            user[element.data]
          );
        });
        columnsData["actions"] = action;
        // columnsData["status"] = await this.deactivate_button(user);

        return columnsData;
      });

      let data = {
        draw: parseInt(params["draw"]),
        iTotalDisplayRecords: !totalRecords ? 0 : totalRecords,
        iTotalRecords: !totalRecordwithFilter ? 0 : totalRecordwithFilter,
        aaData: await Promise.all(promises),
      };

      return data;
    } catch (error) {
      console.log(error);
    }
  },
  dataTableColumns: async (searchValue) => {
    //on basis of name
    return [{ name: { contains: searchValue } }, { _id: searchValue }];
  },
};
