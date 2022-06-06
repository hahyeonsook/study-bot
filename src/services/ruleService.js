const redis = require('redis');
const Octokit = require('octokit').Octokit;
const schedule = require('node-schedule');

const _  = require('lodash');

const User = require("../models/").User;

//todo redis 공통 부분 분리
//todo github 공통 부분 분리
//todo 로그 남기기

/**
 * 매달 1일 0시 0분
 * 모든 유저의 점수를 100으로 초기화한다.
 */
const initJob = schedule.scheduleJob('0 0 0 1 * *', function() {
    const client = redis.createClient({url: ''});
    client.on('error', (err) => console.log('Redis Client Error', err));

    await client.connect();

    const users = User.find({active: true});
    const userIds = _.map(users, (user) => {return user._id});

    for (let userId of userIds) {
        await client.zAdd(userId, 100);
    }
})


/**
 * 매주 수요일 0시 0분
 * Github에 PR에 올라오지 않은 개수만큼 점수를 차감한다.
 * https://docs.github.com/en/rest/pulls/pulls#list-pull-requests
 */
const prCheckJob = schedule.scheduleJob('0 0 * * 2', function() {
    const client  = redis.createClient({url: ''});
    client.on('error', (err) => console.log('Redis Client Error', err));

    await client.connect();

    const users = User.find({active: true});
    const userCounts = _.map(users, (user) => {return {user._id: 0}});

    // Github 연결
    const owner = 'ez-algorithm';
    const repo = 'algorithm';
    const octokit = new Octokit({
        auth: 'ACCESS TOKEN'
    });

    const response = await octokit.request(`GET /repos/${owner}/${repo}/pulls`, {
        owner: owner,
        repo: repo
    });

    // user별 pr 개수 카운트
    for (var pullRequest of response) {
        const githubId = pullRequest['assignee']['login'];
        if (userCounts[githubId]) {
            userCounts[githubId] = 1;
        } else {
            userCounts[githubId] += 1;
        }
    }

    // 점수 감점
    for (var user of users) {
        if (userCounts[user] < 3) {
            // redis 로 점수 차감
        }
    }
})


/**
 * 매주 목요일 18시 0분
 * Github에 리뷰어로 지정된 PR 중에서 리뷰를 진행하지 않으면 점수를 차감한다.
 * https://docs.github.com/en/rest/pulls/comments#get-a-review-comment-for-a-pull-request
 */
const prReviewCheckJob = schedule.scheduleJob('0 18 * * 3', function() {
    const client  = redis.createClient({url: ''});
    client.on('error', (err) => console.log('Redis Client Error', err));

    await client.connect();

    const users = User.find({active: true});
    const reviewers = [];

    // Github 연결
    const owner = 'ez-algorithm';
    const repo = 'algorithm';
    const octokit = new Octokit({
        auth: 'ACCESS TOKEN'
    });

    // PR List 요청
    const pullsResponse = await octokit.request(`GET /repos/${owner}/${repo}/pulls`, {
        owner: owner,
        repo: repo
    });
    for (var pullRequest of response) {
        const pullNumber = pullRequest['id'];
        const requestedReviewers = pullRequest['requested_reviewers']['login'];

        const reviewsResponse = await octokit.request(`GET /repos/${owner}/${repo}/pulls/${pullNumber}/reviews`, {
            owner: owner,
            repo: repo,
            pullNumber: pullNumber
        });
        for (var review of reviewsResponse) {
            if (review['user']['login'] === requestedReviewers) {
                reviewers.push(review['user']['login']);
            }
        }
    }

    // 점수 감점
    for (var user of users) {
        if (! reviewers.includes(user)) {
            // redis 로 점수 차감
        }
    }
})


/**
 * Approved PR을 머지한다.
 * memo 권한이 필요하지 않을까?
 * https://docs.github.com/en/rest/pulls/pulls#merge-a-pull-request
 */
const mergeApprovedPrsJob = schedule.scheduleJob('0 18 * * 3', function() {
    // Github 연결
    const owner = 'ez-algorithm';
    const repo = 'algorithm';
    const octokit = new Octokit({
        auth: 'ACCESS TOKEN'
    });

    // PR List 요청
    const pullsResponse = await octokit.request(`GET /repos/${owner}/${repo}}/pulls`, {
        owner: owner,
        repo: repo
    });

    for (var pullRequest of response) {
        const pullNumber = pullRequest['id'];
        await octokit.request(`PUT /repos/${owner}/${repo}/pulls/${pullNumber}/merge`, {
            owner: owner,
            repo: repo,
            pull_number: pullNumber,
            body: {
                commit_title: '',
                commit_message: ''
            }
        });
    }
})