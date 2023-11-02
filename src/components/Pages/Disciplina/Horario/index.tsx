import { Box } from '@chakra-ui/react';
import { FC, Fragment, useCallback, useState } from 'react';

import { CanAccess } from '@components/CanAccess';
import { PageHeader } from '@components/PageHeader';
import { SemesterForm } from '@components/SemesterForm';
import { OnSelect } from '@components/SemesterForm/types';
import { Wrapper } from '@components/Wrapper';

import { useAdminPermission } from '@hooks/useAdminPermission';

import { Semester } from '@models/Semester';

import { Calendar } from './components/Calendar';
import { LoggedUserDisciplineForm } from './components/LoggedUserDisciplineForm';
import { OnSelect as OnSelectMyDisciplines } from './components/LoggedUserDisciplineForm/types';
import { ProfessorForm } from './components/ProfessorForm';
import { OnSelect as OnSelectProfessor } from './components/ProfessorForm/types';
import { MinistraWithOrigin } from './types';

const Horario: FC = () => {
  const isAdmin = useAdminPermission({ isAdmin: true });
  const [semester, setSemester] = useState<Semester>();
  const [ministra, setMinistra] = useState<MinistraWithOrigin[]>();

  const onSelectSemester = useCallback<OnSelect>(selectedSemester => {
    setSemester(selectedSemester);
    setMinistra([]);
  }, []);

  const onSelectProfessor = useCallback<OnSelectProfessor>(list => {
    setMinistra(oldValue => {
      const oldList = oldValue.filter(v => v.origin !== 'PROFESSOR');
      return [...oldList, ...list];
    });
  }, []);

  const onSelectMyDisciplines = useCallback<OnSelectMyDisciplines>(
    (list, origin) => {
      setMinistra(oldValue => {
        const oldList = oldValue.filter(value => value.origin !== origin);
        return [...oldList, ...list];
      });
    },
    [],
  );

  return (
    <CanAccess pageTitle="Horário das Disciplinas">
      <Wrapper>
        <PageHeader
          title="Verificar horário das disciplinas"
          titleActions={<SemesterForm onSelect={onSelectSemester} />}
        />

        <Box>
          {!isAdmin && (
            <Fragment>
              <LoggedUserDisciplineForm
                origin="LOGGED_USER_QUEUE_DISCIPLINES"
                onSelect={onSelectMyDisciplines}
                semester={semester}
              />
              <LoggedUserDisciplineForm
                origin="LOGGED_USER_NOT_QUEUE_DISCIPLINES"
                onSelect={onSelectMyDisciplines}
                semester={semester}
              />
            </Fragment>
          )}
          <ProfessorForm onSelect={onSelectProfessor} semester={semester} />
        </Box>

        <Calendar ministra={ministra} semester={semester} />
      </Wrapper>
    </CanAccess>
  );
};

export { Horario };
