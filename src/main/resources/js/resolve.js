$(function () {
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

    $.get(
        'https://opengift.io/tasks/jira/get_assigned/?jira=1&issue_id=' + $('.js-issue-id').val(),
        function(data) {
            if (data) {
                try {
                    var task = $.parseJSON(data);
                    $('<p></p>')
                        .append(
                            $('<h2></h2>')
                                .text('Task assigned to')
                        )
                        .append(
                            $('<span></span>')
                                .css({'color': 'grey'})
                                .text(task['project']['name'])
                        )
                        .append(
                            $('<div></div>')
                                .css({'font-weight': 'bold', 'color': 'green'})
                                .text(task.name)
                        )
                        .appendTo($taskList);
                } catch (e) {
                    console.log('error')
                }
            } else {
                getSimilarIssues();
            }
        }
    );

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
                            $('<p></p>')
                                .append(
                                    $('<span></span>')
                                        .css({'color': 'grey'})
                                        .text(task['project']['name'])
                                )
                                .append(
                                    $('<div></div>')
                                        .css({'font-weight': 'bold', 'color': 'green'})
                                        .text(task.name)
                                )
                                .append(
                                    $('<div></div>')
                                        .append(
                                            $('<a></a>')
                                                .data('id', task.id)
                                                .addClass('js-assign-issue')
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