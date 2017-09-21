'use strict';
import {BASE_URL} from '../core/constants/global-setting';


export const PROCESS_SETTING  = {

	URL:{
		START:`${BASE_URL}/bpm/processTypes/{processTypeId}/firstForm`,
		TODOTASKS:`${BASE_URL}/bpm/tasks`,
		SUBMIT:`${BASE_URL}/bpm/tasks/submit?processTypeId={processTypeId}&taskId={taskId}`,
		APPROVE:`${BASE_URL}/bpm/tasks/{taskId}/approve`,
		DISAPPROVE:`${BASE_URL}/bpm/tasks/{taskId}/disapprove`,
		SAVEDRAFT:`${BASE_URL}/bpm/tasks/saveDraft?processTypeId={processTypeId}&taskId={taskId}`,
		CURRENCY:`${BASE_URL}/profileformdata/currencys`,
		DOTASK:`${BASE_URL}/bpm/tasks/{taskId}/form`,
		IMG:`${BASE_URL}/bpm/tasks/img.png?processCode={processCode}`,
		LOG:`${BASE_URL}/bpm/tasks/log?processCode={processCode}`,
		FORMBYPROCODE:`${BASE_URL}/bpm/processInstance/{processCode}/form`,
		TERMINATION:`${BASE_URL}/bpm/processInstance/{processCode}/termination?terminationReason={terminationReason}`,
		DELETE:`${BASE_URL}/bpm/processInstance/{processCode}`,
		DRAFT:`${BASE_URL}/bpm/tasks/draft`,
		DELETEDRAFT:`${BASE_URL}/bpm/tasks/{taskId}/draft`,
		PROCESSINSTANCE:`${BASE_URL}/bpm/processInstance`,
		FinishTask:`${BASE_URL}/bpm/tasks/finished`
	}


}
