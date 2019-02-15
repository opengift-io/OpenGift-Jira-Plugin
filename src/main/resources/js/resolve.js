$(function () {
    $('.js-requirements').appendTo('body');
    $('.js-share-issue--submit').click(function () {
        $.post(
            'https://opengift.io//tasks/jira/create/?jira=1',
            {
                'project': $('input[name=requirements]:checked').val(),
                'issueId': $('.js-issue-id').val(),
                'text': $('.js-issue-summary').val()
            },
            function () {
                getAssigned();
            }
        );
        return false;
    });
    $('.js-share-issue').click(function () {
        $.get(
            'https://opengift.io/project/list/jira/requirements/?jira=1',
            function(data) {
                try {
                    var projects = $.parseJSON(data);
                    var $reqList = $('.js-requirements--req-list').show().empty();
                    for (var i in projects) {
                        var project = projects[i];

                        $('<label></label>').addClass('og-plugin-body-item')
                            .append(
                                $('<input/>')
                                    .attr({
                                        'type': 'radio',
                                        'name': 'requirements',
                                        'checked': (i === 0) ? 'checked' : false,
                                        'value': project.id
                                    })
                            )
                            .append(
                                $('<span></span>')
                                    .css({'font-weight': 'bold', 'color': 'green'})
                                    .text(project.name)
                            ).appendTo($reqList);
                        $('.js-requirements').show();
                    }
                } catch (e) {

                }
            }
        );
        return false;
    });

    $(document).on('click', '.js-assign-issue', function() {
        $.post(
            'https://opengift.io/tasks/jira/assign/?jira=1',
            {
                'issue_id': $('.js-issue-id').val(),
                'text': $('.js-issue-summary').val(),
                'task_id': $(this).data('id')
            },
            function (data) {
                console.log(data);
            }
        );
    });
    function getAssigned() {
        $('.js-requirements').hide();
        $.get(
            'https://opengift.io/tasks/jira/get_assigned/?jira=1&issue_id=' + $('.js-issue-id').val(),
            function(data) {
                if (data) {
                    try {
                        var task = $.parseJSON(data);
                        $('.js-task-list').hide();
                        $('.js-assigned').show();
                        $('.js-og-title').text('Task assigned to')
                        $('.js-assigned--project-name').text(task.project.name);
                        $('.js-assigned--name').text(task.name);
                        $('.js-assigned--requirements').text(task.requirementsQty);
                    } catch (e) {
                        console.log('error')
                    }
                } else {
                    getSimilarIssues();
                }
            }
        );
    }

    getAssigned();
    function getSimilarIssues() {
        $.get(
            'https://opengift.io/tasks/get_similar?jira=1&text='+encodeURI(
                $('.js-issue-summary').val()
            ),
            function (data) {
                var $taskList = $('.js-task-list');

                if (data) {
                    try {
                        data = $.parseJSON(data);
                        $taskList.empty();
                        var k, task;
                        for (k in data) {
                            task = data[k];
                            $('<div></div>').addClass('og-plugin-task-list-item')
                                .append(
                                    $('<div></div>')
                                        .addClass('og-plugin-task-list-item-title')
                                        .text(task['project']['name'])
                                )
                                .append(
                                    $('<div></div>')
                                        .addClass('og-plugin-task-list-item-desc')
                                        .text(task.name)
                                )
                                .append(
                                    $('<div></div>')
                                        .addClass('og-plugin-task-list-item-button')
                                        .append(
                                            $('<a></a>')
                                                .data('id', task.id)
                                                .addClass('js-assign-issue aui-button aui-button-primary')
                                                .text('Assign')
                                        )
                                )
                                .appendTo($taskList);
                        }
                    } catch (e) {

                    }
                }
            }
        );
    }
});